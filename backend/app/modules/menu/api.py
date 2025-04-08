from typing import List
from fastapi import APIRouter, Depends, Request
from .models import MenuCreate, MenuUpdate, MenuPublic, Menu
from better_crud import crud
from app.common.security import DependsJwtAuth
from app.middleware.fastapi_sqlalchemy import db
from app.utils.build_tree import get_tree_data
from app.common.response import response_base, ResponseModel
from .service import MenuService
router = APIRouter()


@crud(
    router,
    feature="menu",
    dto={"create": MenuCreate, "update": MenuUpdate},
    serialize={"base": MenuPublic}
)
class MenuController():
    service: MenuService = Depends(MenuService)

    @router.get("/menu_tree", dependencies=[
        DependsJwtAuth
    ])
    async def get_menu_tree(self, request: Request, parent_id: str = None) -> ResponseModel[List[MenuPublic]]:
        stmt = []
        if parent_id is not None:
            stmt.append(Menu.parent_id == parent_id)
        menus = await self.service.get_list(stmt)
        return response_base.success(data=get_tree_data(menus))
