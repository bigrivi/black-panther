from typing import Any

from fastapi import Request, Response, status
from fastapi.security.utils import get_authorization_scheme_param
from starlette.authentication import AuthCredentials, AuthenticationBackend, AuthenticationError
from starlette.requests import HTTPConnection
from app.extensions import logger
from app.modules.user.models import CurrentUser
from app.config.settings import settings
from app.exception.errors import TokenError
from app.common.security.jwt import jwt_authentication
from app.common.response import BaseResponse


class _AuthenticationError(AuthenticationError):

    def __init__(self, *, code: int = None, msg: str = None, headers: dict[str, Any] | None = None):
        self.code = code
        self.msg = msg
        self.headers = headers


class JwtAuthMiddleware(AuthenticationBackend):

    @staticmethod
    def auth_exception_handler(conn: HTTPConnection, exc: _AuthenticationError) -> Response:
        return BaseResponse(content={'code': exc.code, 'msg': exc.msg}, status_code=exc.code)

    async def authenticate(self, request: Request) -> tuple[AuthCredentials, CurrentUser] | None:
        token = request.headers.get('Authorization')
        if not token:
            return

        if request.url.path in settings.TOKEN_REQUEST_PATH_EXCLUDE:
            return

        scheme, token = get_authorization_scheme_param(token)
        if scheme.lower() != 'bearer':
            return
        try:
            user = await jwt_authentication(token)
        except TokenError as exc:
            raise _AuthenticationError(
                code=exc.code, msg=exc.detail, headers=exc.headers)
        except Exception as e:
            logger.error(e)
            raise _AuthenticationError(code=getattr(
                e, 'code', 500), msg=getattr(e, 'msg', 'Internal Server Error'))
        return AuthCredentials(['authenticated']), user
