from typing import List
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Action


class ActionService(ServiceBase[Action]):
    def __init__(self):
        super().__init__(Action)


action_service = ActionService()
