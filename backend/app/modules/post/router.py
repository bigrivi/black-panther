from .api import router
from app.registrar import register_router


@register_router("/post", ["sys"])
def setup():
    return router
