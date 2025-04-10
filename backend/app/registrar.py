from typing import List, Tuple
from fastapi import FastAPI, APIRouter
from app.middleware.fastapi_sqlalchemy import SQLAlchemyMiddleware
from app.middleware.jwt_auth_middleware import JwtAuthMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from app.config.settings import settings
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from asgi_correlation_id import CorrelationIdMiddleware
from fastapi_events.middleware import EventHandlerASGIMiddleware
from fastapi_events.handlers.local import local_handler
from app.database.core import engine
from app.exception.exception_handler import register_exception
from app.middleware.request_context import RequestContextMiddleware
from app.middleware.operation_log import OperationLogMiddleware
from app.extensions.crud import register_crud

registered_routers: List[Tuple[str, List[str], APIRouter]] = []


def register_router(prefix: str, tags: List[str]):
    def decorator(fun):
        registered_routers.append((prefix, tags, fun()))
    return decorator


def register_middleware(app: FastAPI):
    app.add_middleware(OperationLogMiddleware)
    if settings.MIDDLEWARE_ACCESS:
        from app.middleware.access_middleware import AccessMiddleware
        app.add_middleware(AccessMiddleware)
    app.add_middleware(EventHandlerASGIMiddleware,
                       handlers=[local_handler])   # registering handler(s)
    app.add_middleware(
        AuthenticationMiddleware, backend=JwtAuthMiddleware(), on_error=JwtAuthMiddleware.auth_exception_handler
    )
    app.add_middleware(SQLAlchemyMiddleware, custom_engine=engine)
    if settings.MIDDLEWARE_CORS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ALLOWED_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=settings.CORS_ALLOW_HEADERS,
            expose_headers=settings.CORS_EXPOSE_HEADERS,
        )
    app.add_middleware(
        GZipMiddleware,
        minimum_size=5000
    )
    app.add_middleware(ProxyHeadersMiddleware)
    app.add_middleware(CorrelationIdMiddleware)
    app.add_middleware(RequestContextMiddleware)


def setup_router(app: FastAPI):
    from app import install_router_module
    install_router_module()
    api_router = APIRouter()
    for prefix, tags, router in registered_routers:
        api_router.include_router(router, prefix=prefix, tags=tags)
    app.include_router(api_router, prefix=settings.FASTAPI_API_PATH)


def register_app(app: FastAPI):
    register_crud()
    register_middleware(app)
    register_exception(app)
    setup_router(app)
