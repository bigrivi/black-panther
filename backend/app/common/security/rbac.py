from fastapi import Depends, Request
from app.exception.errors import TokenError, AuthorizationError, ForbiddenError
from app.config.settings import settings
from better_crud import get_action, get_feature
from app.extensions import logger


async def rbac(request: Request) -> None:
    path = request.url.path
    if path in settings.TOKEN_REQUEST_PATH_EXCLUDE:
        return
    if not request.auth.scopes:
        raise TokenError
    if request.user.is_superuser:
        return
    user_roles = request.user.roles
    if not user_roles:
        raise ForbiddenError(msg='用户未分配角色，授权失败')
    if not any(len(role.actions) > 0 for role in user_roles):
        raise ForbiddenError(msg='用户所属角色未分配菜单，授权失败')
    feature = get_feature(request)
    action = get_action(request)
    path_auth_perm = getattr(request.state, 'permission', None)
    if not path_auth_perm and feature and action:
        path_auth_perm = f"{feature}.{action}"
    if not path_auth_perm:
        return
    if path_auth_perm in set(settings.RBAC_ROLE_MENU_EXCLUDE):
        return
    allow_perms = []
    # for role in user_roles:
    #     for action in role.actions:
    #         if action.valid_state:
    #             allow_perms.extend(action.perm_code.split(','))
    logger.debug(path_auth_perm)
    if path_auth_perm not in allow_perms:
        raise ForbiddenError

DependsRBAC = Depends(rbac)
