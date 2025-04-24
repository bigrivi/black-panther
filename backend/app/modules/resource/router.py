from .api import router
from app.registrar import register_router
from .action.api import router as action_router


@register_router("/resource", ["resource"])
def setup():
    router.include_router(action_router, prefix="/{resource_id}/action")
    return router
