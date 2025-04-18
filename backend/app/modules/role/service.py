from fastapi import Request
from typing import List
from sqlalchemy.orm import joinedload
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from app.utils.common import find
from .models import Role
from app.extensions import logger
from app.exception import errors
from app.modules.user.service import user_service, UserService, User
from app.modules.user.models import UserRoleLink
from app.modules.resource.action.service import action_service, Action


class RoleService(ServiceBase[Role]):
    def __init__(self):
        super().__init__(Role)

    async def update_role_actions(self, request: Request, role_id: str, action_ids: List[str]) -> int:
        role = await self.get(role_id, options=[joinedload(Role.actions)])
        if not role:
            raise errors.NotFoundError(msg=f'Role {role_id} does not exist')
        for action_id in action_ids:
            action = await action_service.get(action_id)
            if not action:
                raise errors.NotFoundError(
                    msg='Action {action_id} does not exist')
        role.actions = await action_service.get_list([Action.id.in_(action_ids)])
        db.session.add(role)
        await db.session.commit()
        users = await user_service.get_list([User.roles.any(Role.id == role_id)])
        for user in users:
            await UserService.clear_jwt_cache_user(user_id=user.id)
        return len(role.actions)

    async def add_user_to_role(self, role_id: int, user_ids: List[str]):
        if not user_ids:
            raise errors.BadRequestError(msg="至少选择一个用户")
        role = await self.get_by_id(role_id)
        if role is None:
            raise errors.NotFoundError(msg=f"Role {role_id} not found")
        stmt = [User.id.in_(user_ids)]
        user_list = await user_service.get_list(stmt, options=[joinedload(User.role_links)])
        user_roles = []
        for user in user_list:
            exist = find(user.role_links, lambda x: x.role_id == role_id)
            if exist:
                logger.warning(f"user {user.id} exist role {role_id}")
            else:
                user_role = UserRoleLink(user_id=user.id, role_id=role_id)
                db.session.add(user_role)
                user_roles.append(user_role)
        if len(user_roles) > 0:
            await db.session.commit()

    async def remove_user_for_role(self, role_id: int, user_ids: List[str]):
        if not user_ids:
            raise errors.BadRequestError(msg="至少选择一个用户")
        role = await self.get_by_id(role_id)
        if role is None:
            raise errors.NotFoundError(msg=f"Role {role_id} not found")
        stmt = [User.id.in_(user_ids)]
        user_list = await user_service.get_list(stmt, options=[joinedload(User.role_links)])
        for user in user_list:
            role_ids = [role_link.role_id for role_link in user.role_links]
            if role_id not in role_ids:
                raise errors.BadRequestError(
                    msg=f"用户{user.emp_name}角色{role_id}不存在")
            for role_link in user.role_links:
                if role_link.role_id == role_id:
                    await db.session.delete(role_link)
        await db.session.commit()


role_service = RoleService()
