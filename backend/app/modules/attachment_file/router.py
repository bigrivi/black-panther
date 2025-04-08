from .api import router
from app.registrar import register_router


@register_router("/attachment_file", ["attachment_file"])
def setup():
    return router
