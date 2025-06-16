from fastapi import APIRouter
from .api import router as schema_router
from app.registrar import register_router


@register_router("/schema", ["schema"])
def setup():
    router = APIRouter()
    router.include_router(schema_router)
    return router
