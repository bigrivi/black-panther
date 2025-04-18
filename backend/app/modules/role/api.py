from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from .models import RoleCreate, RoleUpdate, RolePublic
from better_crud import crud
from app.common.security import DependsJwtAuth, DependsRBAC, RequestPermission
from .service import RoleService
from app.common.response import response_base, ResponseModel
router = APIRouter()


@crud(
    router,
    feature="role",
    dto={"create": RoleCreate, "update": RoleUpdate},
    serialize={"base": RolePublic},
    query={
        "joins": {
            "actions": {
                "select": True
            }
        },
    }
)
class RoleController():
    service: RoleService = Depends(RoleService)

    @router.put(
        '/{role_id}/permissions',
        dependencies=[DependsJwtAuth, Depends(
            RequestPermission("role.update_menu")), DependsRBAC]
    )
    async def update_role_actions(
        self,
        request: Request,
        role_id: Annotated[str, Path(...)], action_ids: List[int]
    ) -> ResponseModel:
        count = await self.service.update_role_actions(request=request, role_id=role_id, action_ids=action_ids)
        if count > 0:
            return response_base.success()
        return response_base.fail()

    @router.post(
        '/{role_id}/add_user',
        dependencies=[DependsJwtAuth, Depends(
            RequestPermission("role.add_user")), DependsRBAC]
    )
    async def add_user_to_role(
        self,
        request: Request,
        role_id: Annotated[int, Path(...)], user_ids: List[str]
    ) -> ResponseModel:
        await self.service.add_user_to_role(role_id=role_id, user_ids=user_ids)
        return response_base.success()

    @router.post(
        '/{role_id}/remove_user',
        dependencies=[DependsJwtAuth, Depends(
            RequestPermission("role.add_user")), DependsRBAC]
    )
    async def remove_user_for_role(
        self,
        request: Request,
        role_id: Annotated[int, Path(...)], user_ids: List[str]
    ) -> ResponseModel:
        await self.service.remove_user_for_role(role_id=role_id, user_ids=user_ids)
        return response_base.success()
