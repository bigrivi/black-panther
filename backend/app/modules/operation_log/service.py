import json
from app.config.settings import settings
from app.extensions import logger
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from app.utils.datetime import str_now
from .models import OperationLog, OperationLogCreate


class OperationLogService(ServiceBase[OperationLog]):
    def __init__(self):
        super().__init__(OperationLog)

    @staticmethod
    async def create(*, log_create: OperationLogCreate):
        model_data = log_create.model_dump(exclude_unset=True)
        model_data["operation_time"] = str_now()
        logger.info(json.dumps(model_data, ensure_ascii=False))
        if settings.SYNC_LOG_TO_DB:
            async with db():
                log_model = OperationLog(**model_data)
                db.session.add(log_model)
                await db.session.commit()
