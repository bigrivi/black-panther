from typing import List
from app.exception.errors import BadRequestError
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from app.utils.common import find
from .models import Enum


class EnumService(ServiceBase[Enum]):
    def __init__(self):
        super().__init__(Enum)


enum_service = EnumService()
