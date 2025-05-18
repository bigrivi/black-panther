from typing import List
from fastapi import APIRouter, Depends, Request
from sqlalchemy import and_
from .models import DeptCreate, DeptUpdate, DeptPublic, Dept
from better_crud import crud
from app.common.security import DependsJwtAuth
from app.utils.build_tree import get_tree_data
from app.common.response import response_base, ResponseModel
from .service import DeptService
router = APIRouter()


@crud(
    router,
    feature="dept",
    dto={"create": DeptCreate, "update": DeptUpdate},
    serialize={"base": DeptPublic}
)
class DeptController():
    service: DeptService = Depends(DeptService)

    @router.get("/tree", dependencies=[
        DependsJwtAuth
    ])
    async def get_dept_tree(
        self,
        request: Request,
        parent_id: int = None,
        exclude_id: int = None  # exclude the ID as well as the descendants
    ) -> ResponseModel[List[DeptPublic]]:
        stmt = []
        if parent_id is not None:
            parent = await self.service.get_by_id(parent_id)
            stmt.append(
                and_(Dept.path.like(f"{parent.path}%"), Dept.path != parent.path))
        if exclude_id is not None:
            stmt.append(Dept.id != exclude_id)
        depts = await self.service.get_list(stmt)
        tree_data = get_tree_data(depts)
        tree_data = list(
            filter(lambda x: x["parent_id"] == parent_id, tree_data))
        return response_base.success(data=tree_data)
