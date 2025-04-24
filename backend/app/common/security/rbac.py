from fastapi import Depends, Request
from app.exception.errors import TokenError, AuthorizationError, ForbiddenError
from app.config.settings import settings
from app.modules.user.models import CurrentUser
from better_crud import get_action, get_feature
from app.extensions import logger


async def rbac(request: Request) -> None:
    path = request.url.path
    if path in settings.TOKEN_REQUEST_PATH_EXCLUDE:
        return
    if not request.auth.scopes:
        raise TokenError
    current_user: CurrentUser = request.user
    # if request.user.is_superuser:
    #     return
    permissions = current_user.permissions
    logger.debug(permissions)
    feature = get_feature(request)
    action = get_action(request)
    path_auth_perm = getattr(request.state, 'permission', None)
    if not path_auth_perm and feature and action:
        path_auth_perm = f"{feature}:{action}"
    if not path_auth_perm:
        return
    if path_auth_perm in set(settings.RBAC_PERMISSION_EXCLUDE):
        return
    logger.debug(path_auth_perm)
    if path_auth_perm not in permissions:
        raise ForbiddenError

DependsRBAC = Depends(rbac)
