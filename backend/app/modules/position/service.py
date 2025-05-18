from typing import List
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Position


class PositionService(ServiceBase[Position]):
    def __init__(self):
        super().__init__(Position)


position_service = PositionService()
