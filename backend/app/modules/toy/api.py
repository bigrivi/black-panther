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
)
class ToyController():
    service: ToyService = Depends(ToyService)
