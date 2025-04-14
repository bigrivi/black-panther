from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud
from .models import ResourceCreate, ResourceUpdate, ResourcePublic
from .service import ResourceService
router = APIRouter()


@crud(
    router,
    feature="resource",
    dto={"create": ResourceCreate, "update": ResourceUpdate},
    serialize={"base": ResourcePublic},
    query={
        "joins": {
            "actions": {
                "select": True
            }
        }
    }
)
class ResourceController():
    service: ResourceService = Depends(ResourceService)
