from typing import List

from sqlalchemy import and_
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Department


class DepartmentService(ServiceBase[Department]):
    def __init__(self):
        super().__init__(Department)

    async def on_after_create(self, dept: Department, **kwargs):
        if dept.parent_id:
            parent_node = await self.get_by_id(dept.parent_id)
            dept.path = f"{parent_node.path}{dept.id},"
        else:
            dept.path = f",{dept.id},"

    async def on_after_update(self, dept: Department, **kwargs):
        old_path = dept.path
        if dept.parent_id:
            parent_node = await self.get_by_id(dept.parent_id)
            new_path = f"{parent_node.path}{dept.id},"
        else:
            new_path = f",{dept.id},"
        if old_path != new_path:
            # parent_id change
            dept.path = new_path
            db.session.add(dept)
            descendants = await self.get_descendants(old_path)
            for descendant in descendants:
                descendant.path = descendant.path.replace(
                    old_path, new_path)
                db.session.add(descendant)
            await db.session.commit()

    async def get_descendants(self, path: str) -> List[Department]:
        stmt = []
        stmt.append(and_(Department.path.like(
            path+"%"), Department.path != path))
        descendants = await self.get_list(stmt)
        return descendants


department_service = DepartmentService()
