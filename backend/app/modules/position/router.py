from .api import router
from app.registrar import register_router


@register_router("/position", ["sys"])
def setup():
    return router
