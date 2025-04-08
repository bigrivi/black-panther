from fastapi import APIRouter, Depends, Request
from better_crud import crud
from app.common.security.jwt import DependsJwtAuth
from app.common.response import response_base, ResponseModel
from .service import LoginLogService
from .models import LoginLogPublic

router = APIRouter()


@crud(
    router,
    feature="login_log",
    routes={
        "only": ["get_many"],
    },
    serialize={"base": LoginLogPublic},
)
class LoginLogController():
    service: LoginLogService = Depends(LoginLogService)
