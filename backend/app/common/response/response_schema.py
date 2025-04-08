from datetime import datetime
from typing import Any, TypeVar, Generic

from fastapi import Response
from pydantic import ConfigDict
from better_crud import AbstractResponseModel
from .serializers import BaseResponse
from .response_code import CustomResponse, CustomResponseCode
from app.config.settings import settings
T = TypeVar("T")

__all__ = ['ResponseModel', 'response_base']


class ResponseModel(AbstractResponseModel, Generic[T]):

    model_config = ConfigDict(
        json_encoders={datetime: lambda x: x.strftime(settings.DATETIME_FORMAT)})

    code: int = CustomResponseCode.HTTP_200.code
    msg: str = CustomResponseCode.HTTP_200.msg
    data: T | None = None

    @classmethod
    def create(
        cls, content: Any
    ):
        return cls(
            data=content,
            msg="success"
        )


class ResponseBase:

    @staticmethod
    def __response(*, res: CustomResponseCode | CustomResponse = None, data: Any | None = None) -> ResponseModel:
        return ResponseModel(code=res.code, msg=res.msg, data=data)

    def success(
        self,
        *,
        res: CustomResponseCode | CustomResponse = CustomResponseCode.HTTP_200,
        data: Any | None = None,
    ) -> ResponseModel:
        return self.__response(res=res, data=data)

    def fail(
        self,
        *,
        res: CustomResponseCode | CustomResponse = CustomResponseCode.HTTP_400,
        data: Any = None,
    ) -> ResponseModel:
        return self.__response(res=res, data=data)

    @staticmethod
    def fast_success(
        *,
        res: CustomResponseCode | CustomResponse = CustomResponseCode.HTTP_200,
        data: Any | None = None,
    ) -> Response:
        return BaseResponse({'code': res.code, 'msg': res.msg, 'data': data})


response_base: ResponseBase = ResponseBase()
