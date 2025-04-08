from typing import Any
from fastapi.responses import ORJSONResponse
from fastapi.encoders import jsonable_encoder

class BaseResponse(ORJSONResponse):

    def render(self, content: Any) -> bytes:
        return super().render(content)
