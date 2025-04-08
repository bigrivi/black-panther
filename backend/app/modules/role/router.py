from .api import router
from app.registrar import register_router

@register_router("/role",["role"])
def setup():
    return router
