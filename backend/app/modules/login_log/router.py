from .api import router
from app.registrar import register_router


@register_router("/login_log", ["sys"])
def setup():
    return router
