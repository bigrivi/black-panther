from typing import List
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Toy


class ToyService(ServiceBase[Toy]):
    def __init__(self):
        super().__init__(Toy)
