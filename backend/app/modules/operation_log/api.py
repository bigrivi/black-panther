from fastapi import APIRouter, Depends, Request
from better_crud import crud
from app.common.security.jwt import DependsJwtAuth
from app.common.response import response_base, ResponseModel
from .service import OperationLogService
from .models import OperationLog, OperationLogPublic

router = APIRouter()


@crud(
    router,
    feature="operation_log",
    routes={
        "only": ["get_many"],
    },
    serialize={"base": OperationLogPublic},
)
class OperationLogController():
    service: OperationLogService = Depends(OperationLogService)
