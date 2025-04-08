from typing import Annotated
from fastapi import APIRouter, Depends, Request, Body, BackgroundTasks
from .models import UserLoginRequestModel, AuthLoginSuccessModel, TokenModel
from .service import AuthService
from app.common.security.jwt import DependsJwtAuth
from app.common.response.response_schema import ResponseModel, response_base
router = APIRouter()


@router.post(
    '/login',
)
async def user_login(
    request: Request,
    login_model: UserLoginRequestModel,
    background_tasks: BackgroundTasks,
    auth_service: AuthService = Depends(AuthService),
) -> ResponseModel[AuthLoginSuccessModel]:
    data = await auth_service.login(request=request, login_model=login_model, background_tasks=background_tasks)
    return response_base.success(data=data)


@router.post('/logout', dependencies=[DependsJwtAuth])
async def user_logout(request: Request, auth_service: AuthService = Depends(AuthService)):
    await auth_service.logout(request=request)


@router.post('/token/new', dependencies=[DependsJwtAuth])
async def create_new_token(request: Request, refresh_token: Annotated[str, Body(...)], auth_service: AuthService = Depends(AuthService)) -> ResponseModel[TokenModel]:
    return response_base.success(data=await auth_service.new_token(refresh_token, request=request))
