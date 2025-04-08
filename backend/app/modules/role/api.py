from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from .models import RoleCreate, RoleUpdate, RolePublic
from fastapi_pagination import pagination_ctx
from better_crud import crud, Page, GetQuerySearch, GetQuerySorts, QuerySortDict
from app.common.security import DependsJwtAuth, DependsRBAC, RequestPermission
from app.modules.menu.models import MenuPublic
from .service import RoleService
from app.common.response import response_base, ResponseModel
from app.modules.menu.service import menu_service, Menu
router = APIRouter()


@crud(
    router,
    feature="role",
    dto={"create": RoleCreate, "update": RoleUpdate},
    serialize={"base": RolePublic},
    query={
        "joins": {
            "menus": {
                "select": True,
                "select_only_detail": True
            }
        },
    }
)
class RoleController():
    service: RoleService = Depends(RoleService)

    @router.get("/{role_id}/menus", dependencies=[Depends(pagination_ctx(Page)), DependsJwtAuth])
    async def get_role_menus(
        self,
        request: Request,
        role_id: str = Path(..., title="The ID of the item to get"),
        search: Dict = Depends(GetQuerySearch()),
        sorts: List[QuerySortDict] = Depends(GetQuerySorts()),
    ) -> ResponseModel[Page[MenuPublic]]:
        role = await self.service.get(role_id)
        data = await menu_service.get_paginated_list(
            [Menu.roles.contains(role)],
            search=search,
            sorts=sorts
        )
        return response_base.success(data=data)

    @router.put(
        '/{role_id}/menus',
        dependencies=[DependsJwtAuth, Depends(
            RequestPermission("role.update_menu")), DependsRBAC]
    )
    async def update_role_menus(
        self,
        request: Request,
        role_id: Annotated[str, Path(...)], menu_ids: List[int]
    ) -> ResponseModel:
        count = await self.service.update_role_menu(request=request, role_id=role_id, menu_ids=menu_ids)
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
