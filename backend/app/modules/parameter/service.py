from typing import List
from app.exception.errors import BadRequestError
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Parameter


class ParameterService(ServiceBase[Parameter]):
    def __init__(self):
        super().__init__(Parameter)


param_service = ParameterService()
