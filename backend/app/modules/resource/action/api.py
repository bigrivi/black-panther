from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud

from app.common.security.rbac import DependsRBAC
from .models import ActionCreate, ActionUpdate, ActionPublic
from .service import ActionService
router = APIRouter()


@crud(
    router,
    feature="resource",
    dto={"create": ActionCreate, "update": ActionUpdate},
    serialize={"base": ActionPublic},
    routes={
        "exclude": ["get_many", "update_many"],
        "dependencies": [DependsRBAC],
        "create_one": {
            "action": "create-action"
        },
        "delete_many": {
            "action": "delete-action"
        },
        "get_one": {
            "action": "show-action"
        },
        "update_one": {
            "action": "edit-action"
        }
    },
    query={
        "soft_delete": False,
    },
    params={
        "resource_id": {
            "field": "resource_id",
            "type": "int"
        }
    }
)
class ActionController():
    service: ActionService = Depends(ActionService)
