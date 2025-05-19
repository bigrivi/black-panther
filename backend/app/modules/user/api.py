import asyncio
from typing import List
from fastapi import APIRouter, Depends, Request, Body, Path
from .models import UserCreate, UserUpdate, UserPublic, CurrentUser
from sqlalchemy.orm import joinedload
from better_crud import crud
from app.exception import errors
from app.common.security import DependsJwtAuth, RequestPermission, DependsRBAC
from app.common.response import response_base, ResponseModel
from app.common.security.jwt import verify_password
from .service import UserService, User
router = APIRouter()


@crud(
    router,
    feature="user",
    dto={"create": UserCreate, "update": UserUpdate},
    serialize={"base": UserPublic},
    query={
        "joins": {
            "roles": {
                "select": True,
                "join": True
            },
            "department": {
                "select": True,
                "join": True
            }
        }
    }
)
class UserController():
    service: UserService = Depends(UserService)

    @router.get(
        "/me",
        dependencies=[DependsJwtAuth],
        response_model=ResponseModel[CurrentUser]
    )
    async def info(self, request: Request):
        return response_base.success(data=self.service.get_current_user())

    @router.post("/reset_password", dependencies=[DependsJwtAuth])
    async def reset_password(self, request: Request, new_pwd: str = Body(..., min_length=4), old_pwd: str = Body(..., min_length=4)):
        current_user: User = await self.service.get_by_id(request.user.identity)
        if verify_password(old_pwd, current_user.password):
            await self.service.update_password(current_user.user_id, new_pwd)
            return True
        raise errors.BadRequestError(msg="The original password is incorrect")

    @router.put("/{id}/update_password", dependencies=[
        DependsJwtAuth,
        Depends(RequestPermission("user.update_password")),
        DependsRBAC
    ])
    async def update_password(self, request: Request, id: int = Path(..., title="The ID of the item to get"), new_pwd: str = Body(..., min_length=4)):
        '''
        update user password
        '''
        await self.service.update_password(id, new_pwd)
