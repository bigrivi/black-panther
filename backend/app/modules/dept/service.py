from typing import List

from sqlalchemy import and_
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Dept


class DeptService(ServiceBase[Dept]):
    def __init__(self):
        super().__init__(Dept)

    async def on_after_create(self, dept: Dept, **kwargs):
        if dept.parent_id:
            parent_node = await self.get_by_id(dept.parent_id)
            dept.path = f"{parent_node.path}{dept.id},"
        else:
            dept.path = f",{dept.id},"

    async def on_after_update(self, dept: Dept, **kwargs):
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

    async def get_descendants(self, path: str) -> List[Dept]:
        stmt = []
        stmt.append(and_(Dept.path.like(path+"%"), Dept.path != path))
        descendants = await self.get_list(stmt)
        return descendants


dept_service = DeptService()
