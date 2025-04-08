from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Dept


class DeptService(ServiceBase[Dept]):
    def __init__(self):
        super().__init__(Dept)


dept_service = DeptService()
