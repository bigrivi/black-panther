from contextvars import ContextVar

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from fastapi import Request


REQUEST_ID_CTX_KEY = "request_id"

_request_id_ctx_var: ContextVar[Request] = ContextVar(
    REQUEST_ID_CTX_KEY, default=None)


def get_request() -> Request:
    return _request_id_ctx_var.get()


class RequestContextMiddleware(BaseHTTPMiddleware):

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ):

        request_id = _request_id_ctx_var.set(request)
        response = await call_next(request)
        _request_id_ctx_var.reset(request_id)
        return response
