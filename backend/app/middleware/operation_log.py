from asyncio import create_task
import dataclasses
from fastapi import Response
from datetime import datetime
from starlette.datastructures import UploadFile
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.authentication import UnauthenticatedUser
from starlette.requests import Request
from app.extensions import logger
from app.config.settings import settings
from app.utils.trace_id import get_request_trace_id
from app.modules.operation_log.models import OperationLogCreate
from app.modules.operation_log.service import OperationLogService
from app.modules.user import get_current_user
from app.utils.request import get_request_ip, get_user_agent_info


@dataclasses.dataclass
class RequestCallNext:
    code: str
    msg: str
    status: int
    err: Exception | None
    response: Response


class OperationLogMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next) -> Response:
        path = request.url.path

        if path in settings.OPERA_LOG_EXCLUDES or not path.startswith(f'{settings.FASTAPI_API_PATH}'):
            return await call_next(request)
        if isinstance(request.user, UnauthenticatedUser):
            return await call_next(request)
        method = request.method
        args = await self.get_request_args(request)
        current_user = get_current_user()
        start_time = datetime.now()
        request_res = await self.execute_request(request, call_next)
        end_time = datetime.now()
        cost_time_ms = (end_time - start_time).total_seconds() * 1000.0

        _route = request.scope.get('route')
        summary = getattr(_route, 'summary', None) or ''
        ua_info = get_user_agent_info(request)

        log_model = OperationLogCreate(
            trace_id=get_request_trace_id(request),
            user_id=current_user.id,
            user_name=current_user.user_name,
            method=method,
            title=summary,
            path=path,
            ip=get_request_ip(request),
            user_agent=ua_info.user_agent,
            os=ua_info.os,
            browser=ua_info.browser,
            device=ua_info.device,
            args=args,
            status=request_res.status,
            code=request_res.code,
            msg=request_res.msg,
            cost_time=cost_time_ms,
            operation_time=start_time,
        )
        create_task(OperationLogService.create(log_create=log_model))

        err = request_res.err
        if err:
            raise err from None

        return request_res.response

    async def execute_request(self, request: Request, call_next) -> RequestCallNext:
        code = 200
        msg = 'Success'
        status = 1
        err = None
        response = None
        try:
            response = await call_next(request)
            code, msg = self.request_exception_handler(request, code, msg)
        except Exception as e:
            logger.error(f'请求异常: {e}')
            code = getattr(e, 'code', None) or code
            msg = getattr(e, 'msg', None) or msg
            status = 0
            err = e

        return RequestCallNext(code=str(code), msg=msg, status=status, err=err, response=response)

    @staticmethod
    def request_exception_handler(request: Request, code: int, msg: str) -> tuple[str, str]:
        exception_states = [
            '__request_http_exception__',
            '__request_validation_exception__',
            '__request_pydantic_user_error__',
            '__request_assertion_error__',
            '__request_custom_exception__',
            '__request_all_unknown_exception__',
            '__request_cors_500_exception__',
        ]
        for state in exception_states:
            exception = getattr(request.state, state, None)
            if exception:
                code = exception.get('code')
                msg = exception.get('msg')
                logger.error(f'请求异常: {msg}')
                break
        return code, msg

    @staticmethod
    async def get_request_args(request: Request) -> dict:
        args = dict(request.query_params)
        args.update(request.path_params)
        body_data = await request.body()
        form_data = await request.form()
        if len(form_data) > 0:
            args.update({k: v.filename if isinstance(v, UploadFile)
                        else v for k, v in form_data.items()})
        else:
            if body_data:
                json_data = await request.json()
                if not isinstance(json_data, dict):
                    json_data = {
                        f'{type(json_data)}_to_dict_data': json_data.decode('utf-8')
                        if isinstance(json_data, bytes)
                        else json_data
                    }
                args.update(json_data)
        return args
