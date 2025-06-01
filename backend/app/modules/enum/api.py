from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud
from .models import EnumCreate, EnumUpdate, EnumPublic
from .service import EnumService
router = APIRouter()


@crud(
    router,
    feature="enum",
    dto={"create": EnumCreate, "update": EnumUpdate},
    serialize={"base": EnumPublic},
    query={
        "joins": {
            "items": {
                "select": True
            }
        }
    }
)
class EnumController():
    service: EnumService = Depends(EnumService)
