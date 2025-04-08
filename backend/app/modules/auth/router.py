from fastapi import APIRouter
from .api import router as auth_router
from .captcha.api import router as captcha_router
from app.registrar import register_router


@register_router("/auth", ["auth"])
def setup():
    router = APIRouter()
    router.include_router(auth_router)
    router.include_router(captcha_router, prefix="/captcha")
    return router
