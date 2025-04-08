from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Menu

class MenuService(ServiceBase[Menu]):
    def __init__(self):
        super().__init__(Menu)

menu_service = MenuService()
