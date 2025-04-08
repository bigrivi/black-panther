from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import OperationLog, OperationLogCreate


class OperationLogService(ServiceBase[OperationLog]):
    def __init__(self):
        super().__init__(OperationLog)

    @staticmethod
    async def create(*, log_create: OperationLogCreate):
        async with db():
            model_data = log_create.model_dump(exclude_unset=True)
            log_model = OperationLog(**model_data)
            db.session.add(log_model)
            await db.session.commit()
