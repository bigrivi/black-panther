from pydantic import BaseModel, Field


class CaptchaResponseModel(BaseModel):
    image_type: str
    image: str
    uuid: str
