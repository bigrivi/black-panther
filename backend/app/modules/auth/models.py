from pydantic import BaseModel, Field


class TokenModel(BaseModel):
    access_token: str
    access_token_expire_time: int
    refresh_token: str
    refresh_token_expire_time: int


class AuthLoginSuccessModel(TokenModel):
    is_first_login: bool


class UserLoginRequestModel(BaseModel):
    login_name: str = Field(..., min_length=2)
    password: str = Field(..., min_length=2)
    captcha: str = Field(...)
    uuid: str = Field(..., description="UUID")
