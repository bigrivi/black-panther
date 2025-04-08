from fastapi import Request
from datetime import datetime
from app.middleware.fastapi_sqlalchemy import db
from app.extensions import logger
from app.common.service.base import ServiceBase
from .models import LoginLog
from app.utils.request import get_request_ip, get_user_agent_info
from app.utils.trace_id import get_request_trace_id


class LoginLogService(ServiceBase[LoginLog]):
    def __init__(self):
        super().__init__(LoginLog)

    @staticmethod
    async def create(
        request: Request,
        user_id: str,
        user_name: str,
        status: int,
        msg: str
    ):
        try:
            async with db():
                ua_info = get_user_agent_info(request)
                log_model = LoginLog(
                    trace_id=get_request_trace_id(request),
                    user_id=user_id,
                    user_name=user_name,
                    status=status,
                    msg=msg,
                    ip=get_request_ip(request),
                    user_agent=ua_info.user_agent,
                    os=ua_info.os,
                    browser=ua_info.browser,
                    device=ua_info.device,
                    login_time=datetime.now(),
                )
                db.session.add(log_model)
                await db.session.commit()
        except Exception as e:
            logger.error(f'Failed to create login logs: {e}')
