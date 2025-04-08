from .api import router
from app.registrar import register_router


@register_router("/dept", ["sys"])
def setup():
    return router
