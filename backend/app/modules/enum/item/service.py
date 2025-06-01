from typing import List
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import EnumItem


class EnumItemService(ServiceBase[EnumItem]):
    def __init__(self):
        super().__init__(EnumItem)


enum_item_service = EnumItemService()
