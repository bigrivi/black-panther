from fastapi import Request
import re
from typing import List, Optional
from sqlalchemy.orm import joinedload
from app.exception import errors
from app.common.security.jwt import get_hashed_password
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from app.modules.resource.action.models import Action
from .models import User, CurrentUser
from app.extensions import redis_client
from app.config.settings import settings
from app.middleware.request_context import get_request
from app.modules.role.models import Role
from .models import UserCreate, UserUpdate


def get_current_user() -> CurrentUser:
    request = get_request()
    return request.user


class UserService(ServiceBase[User]):
    def __init__(self):
        super().__init__(User)

    async def on_before_create(self, user_create: UserCreate, **kwargs):
        hashed_password = get_hashed_password(user_create.password)
        user_create.password = hashed_password

    async def get_by_role(self, role_id, load_role: Optional[bool] = False, load_user_post: Optional[bool] = False) -> List[User]:
        stmt = []
        options = []
        if load_role:
            options.append(joinedload(User.roles))
        if load_user_post:
            options.append(joinedload(User.user_posts))
        stmt.append(User.roles.any(Role.id == role_id))
        return await self.get_list(stmt, options=options)

    @staticmethod
    async def clear_jwt_cache_user(request: Optional[Request] = None, user_id: Optional[int] = None):
        clear_user_id = user_id
        if request:
            clear_user_id = request.user.id
        if clear_user_id:
            await redis_client.delete(f'{settings.JWT_USER_REDIS_PREFIX}:{str(clear_user_id)}')

    @staticmethod
    def get_current_user() -> CurrentUser:
        request = get_request()
        return request.user

    async def get_current_user_data(self, user_id) -> CurrentUser:
        current_user = await user_service.get(
            user_id,
            options=[
                joinedload(User.roles).joinedload(
                    Role.actions).joinedload(Action.resource),
            ]
        )
        permissions = []
        for role in current_user.roles:
            for action in role.actions:
                permissions.append(f"{action.resource.key}:{action.name}")
        return CurrentUser.model_validate(current_user, from_attributes=True, update={"permissions": list(set(permissions))})

    async def update_password(self, id, new_password: str):
        entity = await self.get_by_id(id)
        hash_password = get_hashed_password(new_password)
        entity.password = hash_password
        db.session.add(entity)
        await db.session.flush()
        await db.session.commit()


user_service = UserService()
