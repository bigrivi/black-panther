from .api import router
from app.registrar import register_router
from .item.api import router as action_router


@register_router("/enum", ["enum"])
def setup():
    router.include_router(action_router, prefix="/{enum_id}/item")
    return router
