from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud
from .models import ToyCreate, ToyUpdate, ToyPublic
from .service import ToyService
router = APIRouter()


@crud(
    router,
    feature="toy",
    dto={"create": ToyCreate, "update": ToyUpdate},
    serialize={"base": ToyPublic},
    query={
        "joins": {
            "department": {
                "select": True
            },
            "position": {
                "select": True
            },
            "details": {
                "select": True
            },
            "roles": {
                "select": True
            }
        }
    }
)
class ToyController():
    service: ToyService = Depends(ToyService)
