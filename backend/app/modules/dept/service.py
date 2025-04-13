from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Dept, DeptCreate, DeptUpdate


class DeptService(ServiceBase[Dept]):
    def __init__(self):
        super().__init__(Dept)

    async def on_after_create(self, dept: Dept, **kwargs):
        if dept.parent_id:
            parent_node = await self.get_by_id(dept.parent_id)
            dept.path = parent_node.path+","+str(dept.id)
        else:
            dept.path = str(dept.id)

    async def on_before_update(self, dept: Dept, dept_update: DeptUpdate, **kwargs):
        if dept_update.parent_id is not None and dept_update.parent_id != dept.parent_id:
            parent_node = await self.get_by_id(dept_update.parent_id)
            return {
                "path": parent_node.path+","+str(dept.id)
            }


dept_service = DeptService()
