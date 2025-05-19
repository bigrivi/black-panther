from typing import List
from fastapi import APIRouter, Depends, Request
from sqlalchemy import and_
from .models import DepartmentCreate, DepartmentUpdate, DepartmentPublic, Department
from better_crud import crud
from app.common.security import DependsJwtAuth
from app.utils.build_tree import get_tree_data
from app.common.response import response_base, ResponseModel
from .service import DepartmentService
router = APIRouter()


@crud(
    router,
    feature="department",
    dto={"create": DepartmentCreate, "update": DepartmentUpdate},
    serialize={"base": DepartmentPublic}
)
class DepartmentController():
    service: DepartmentService = Depends(DepartmentService)

    @router.get("/tree", dependencies=[
        DependsJwtAuth
    ])
    async def get_tree(
        self,
        request: Request,
        parent_id: int = None,
        exclude_id: int = None  # exclude the ID as well as the descendants
    ) -> ResponseModel[List[DepartmentPublic]]:
        stmt = []
        if parent_id is not None:
            parent = await self.service.get_by_id(parent_id)
            stmt.append(
                and_(Department.path.like(f"{parent.path}%"), Department.path != parent.path))
        if exclude_id is not None:
            stmt.append(Department.id != exclude_id)
        departments = await self.service.get_list(stmt)
        tree_data = get_tree_data(departments)
        tree_data = list(
            filter(lambda x: x["parent_id"] == parent_id, tree_data))
        return response_base.success(data=tree_data)
