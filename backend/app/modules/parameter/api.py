from fastapi import APIRouter, Depends
from better_crud import crud
from .models import ParameterPublic, ParameterCreate, ParameterUpdate
from .service import ParameterService
router = APIRouter()


@crud(
    router,
    feature="parameter",
    dto={"create": ParameterCreate, "update": ParameterUpdate},
    serialize={"base": ParameterPublic},
)
class ParameterController():
    service: ParameterService = Depends(ParameterService)
