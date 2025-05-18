from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud
from .models import PositionCreate, PositionUpdate, PositionPublic
from .service import PositionService
router = APIRouter()


@crud(
    router,
    feature="position",
    dto={"create": PositionCreate, "update": PositionUpdate},
    serialize={"base": PositionPublic},
)
class PostController():
    service: PositionService = Depends(PositionService)
