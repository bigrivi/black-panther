from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud
from .models import ActionCreate, ActionUpdate, ActionPublic
from .service import ActionService
router = APIRouter()


@crud(
    router,
    feature="action",
    dto={"create": ActionCreate, "update": ActionUpdate},
    serialize={"base": ActionPublic},
    params={
        "resource_id": {
            "field": "resource_id",
            "type": "int"
        }
    }
)
class ActionController():
    service: ActionService = Depends(ActionService)
