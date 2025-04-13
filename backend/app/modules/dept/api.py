from typing import List
from fastapi import APIRouter, Depends, Request
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
    async def get_dept_tree(self, request: Request, parent_id: str = None) -> ResponseModel[List[DeptPublic]]:
        stmt = []
        if parent_id is not None:
            stmt.append(Dept.parent_id == parent_id)
        depts = await self.service.get_list(stmt)
        return response_base.success(data=get_tree_data(depts))
