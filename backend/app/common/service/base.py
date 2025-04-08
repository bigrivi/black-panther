from typing import List, TypeVar, Generic, Optional, Sequence, Any, Dict, Union
from sqlalchemy import delete
from fastapi import Request
from datetime import datetime
from sqlalchemy.sql.selectable import Select
from sqlalchemy.orm.interfaces import ORMOption
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy import or_, update, func
from sqlalchemy.future import select
from sqlalchemy.sql.elements import OperatorExpression
from app.middleware.fastapi_sqlalchemy import db
from app.utils.datetime import now
from fastapi_pagination.ext.sqlalchemy import paginate
from better_crud import QuerySortDict, Page, decide_should_paginate
from better_crud.service.sqlalchemy import SqlalchemyCrudService

ModelType = TypeVar('ModelType')

SORT_BY_KEY = "sort_by"
SORT_METHOD_KEY = "sort_method"
SORT = "sort"
OPTIONS_KEY = "options"
JOIN_KEY = "joins"
ALIASED_KEY = "aliased"
SELECT_KEY = "selects"
ORDER_KEY = "orders"
DISTINCTS_KEY = "distincts"
INCLUDE_EXPIRY_KEY = "include_expiry"

SOFT_DELETED_FIELD_KEY = "expiry_at"


class ServiceBase(Generic[ModelType], SqlalchemyCrudService[ModelType]):

    entity: object = NotImplementedError

    def __init__(self, entity: object, **kwargs):
        self.entity = entity
        super().__init__(entity)
        self.primary_key = entity.__mapper__.primary_key[0].name

    async def get(
        self,
        id: Union[int, str],
        options: Optional[Sequence[ORMOption]] = None,
    ) -> ModelType:
        return await db.session.get(self.entity, id, options=options)

    async def get_by_id(
        self,
        id: Union[int, str],
        options: Optional[Sequence[ORMOption]] = None,
    ) -> ModelType:
        return await self.get(id, options=options)

    def build_query(
        self,
        search: Optional[Dict] = None,
        include_deleted: Optional[bool] = False,
        soft_delete: Optional[bool] = True,
        joins: Optional[List[InstrumentedAttribute]] = None,
        options: Optional[Sequence[ORMOption]] = None,
        sorts: Optional[List[QuerySortDict]] = None,
        criterions: Optional[List[OperatorExpression]] = None
    ) -> Select[Any]:
        conds = []
        if criterions:
            conds = conds+criterions
        if search:
            conds = conds + self.create_search_condition(search)
        if self.entity_has_delete_column and soft_delete:
            if not include_deleted:
                conds.append(or_(getattr(self.entity, SOFT_DELETED_FIELD_KEY) > datetime.now(),
                                 getattr(self.entity, SOFT_DELETED_FIELD_KEY) == None))
        stmt = select(self.entity)
        if joins and len(joins) > 0:
            for join_item in joins:
                if isinstance(join_item, tuple):
                    stmt = stmt.join(*join_item, isouter=True)
                else:
                    stmt = stmt.join(join_item, isouter=True)
        if options:
            stmt = stmt.options(*options)
        stmt = stmt.where(*conds)
        stmt = self.prepare_order(stmt, sorts)
        return stmt

    async def get_list(
        self,
        criterions: List[OperatorExpression],
        *,
        search: Optional[dict] = None,
        joins: Optional[List[Any]] = None,
        options: Optional[Sequence[ORMOption]] = None,
        sorts: List[QuerySortDict] = None,
        include_deleted: Optional[bool] = False,
        populate_existing: Optional[bool] = False
    ) -> List[ModelType]:
        query = self.build_query(
            search=search,
            include_deleted=include_deleted,
            soft_delete=True,
            joins=joins,
            options=options,
            sorts=sorts,
            criterions=criterions
        )
        if populate_existing:
            query = query.execution_options(populate_existing=True)
        result = await db.session.execute(query)
        return result.unique().scalars().all()

    async def get_paginated_list(
        self,
        criterions: List[OperatorExpression],
        *,
        search: Optional[dict] = None,
        joins: Optional[List[Any]] = None,
        options: Optional[Sequence[ORMOption]] = None,
        sorts: List[QuerySortDict] = None,
        populate_existing: Optional[bool] = False
    ) -> Union[Page[ModelType], List[ModelType]]:
        query = self.build_query(
            search=search,
            include_deleted=True,
            soft_delete=True,
            joins=joins,
            options=options,
            sorts=sorts,
            criterions=criterions
        )
        if populate_existing:
            query = query.execution_options(populate_existing=True)
        if decide_should_paginate():
            return await paginate(db.session, query)
        result = await db.session.execute(query)
        return result.unique().scalars().all()

    async def get_one(
        self,
        criterions: Union[OperatorExpression, List[OperatorExpression]],
        options: Optional[Sequence[ORMOption]] = None,
        sorts: List[QuerySortDict] = None,
        include_deleted: Optional[bool] = False,
        populate_existing: Optional[bool] = False
    ) -> ModelType:
        if not isinstance(criterions, list):
            criterions = [criterions]
        query = self.build_query(
            include_deleted=include_deleted,
            soft_delete=True,
            options=options,
            sorts=sorts,
            criterions=criterions
        )
        if populate_existing:
            query = query.execution_options(populate_existing=True)
        result = await db.session.execute(query)
        return result.scalars().first()

    async def batch_disabled_status(self, id_list: list):
        await self.batch_update({"valid_state": 0}, getattr(self.entity, self.primary_key).in_(id_list))

    async def batch_enable_status(self, id_list: list):
        await self.batch_update({"valid_state": 1}, getattr(self.entity, self.primary_key).in_(id_list))

    async def batch_logic_delete(self, id_list: list):
        await self.batch_update({"expiry_at": now()}, getattr(self.entity, self.primary_key).in_(id_list))

    async def batch_logic_delete_from_stmt(self, stmt: list):
        await self.batch_update({"expiry_at": now()}, stmt)

    async def batch_delete(self, id_list: list):
        statement = delete(self.entity).where(
            getattr(self.entity, self.primary_key).in_(id_list))
        await db.session.execute(statement)
        await db.session.commit()

    async def delete_many(self, stmt):
        if not isinstance(stmt, list):
            stmt = [stmt]
        statement = delete(self.entity).where(*stmt)
        await db.session.execute(statement)
        await db.session.commit()

    async def batch_update(self, values: dict, stmt):
        if not isinstance(stmt, list):
            stmt = [stmt]
        select = update(self.entity).where(*stmt).values(values)
        await db.session.execute(select)
        await db.session.commit()

    async def get_sum(self, stmt: list, field):
        query = select(
            func.sum(field)
        ).where(*stmt)
        executed_res = await db.session.execute(query)
        count = executed_res.scalar()
        return count

    async def get_count(self, stmt: list, field):
        query = select(
            func.count(field)
        ).where(*stmt)
        executed_res = await db.session.execute(query)
        count = executed_res.scalar()
        return count

    async def get_min(self, stmt: list, field):
        query = select(
            func.min(field)
        ).where(*stmt)
        executed_res = await db.session.execute(query)
        return executed_res.scalar()

    async def get_max(self, stmt: list, field):
        query = select(
            func.max(field)
        ).where(*stmt)
        executed_res = await db.session.execute(query)
        return executed_res.scalar()

    async def delete(self, entity) -> None:
        await db.session.delete(entity)
        await db.session.flush()
        await db.session.commit()

    async def delete_by_id(self, id) -> None:
        entity = await self.get_by_id(id)
        await db.session.delete(entity)
        await db.session.flush()
        await db.session.commit()
