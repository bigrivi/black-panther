
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from datetime import datetime
from app.extensions import logger


class AccessMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start_time = datetime.now()
        response = await call_next(request)
        end_time = datetime.now()
        logger.info(
            f'{request.client.host: <15} | {request.method: <8} | {response.status_code: <6} | '
            f'{request.url.path} | {round((end_time - start_time).total_seconds(), 3) * 1000.0}ms'
        )
        return response
