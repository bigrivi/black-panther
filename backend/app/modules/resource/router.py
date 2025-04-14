from .api import router
from app.registrar import register_router


@register_router("/resource", ["resource"])
def setup():
    return router
