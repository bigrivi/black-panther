from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud

from app.common.security.rbac import DependsRBAC
from .models import EnumItemCreate, EnumItemUpdate, EnumItemPublic
from .service import EnumItemService
router = APIRouter()


@crud(
    router,
    feature="enum",
    dto={"create": EnumItemCreate, "update": EnumItemUpdate},
    serialize={"base": EnumItemPublic},
    routes={
        "exclude": ["get_many", "update_many"],
        "dependencies": [DependsRBAC],
        "create_one": {
            "action": "create-item"
        },
        "delete_many": {
            "action": "delete-item"
        },
        "get_one": {
            "action": "show-item"
        },
        "update_one": {
            "action": "edit-item"
        }
    },
    query={
        "soft_delete": True,
    },
    params={
        "enum_id": {
            "field": "enum_id",
            "type": "int"
        }
    }
)
class EnumItemController():
    service: EnumItemService = Depends(EnumItemService)
