import configparser
from typing import List, Literal
from loguru import logger
import os
import tempfile
from dotenv import load_dotenv
from pydantic import model_validator
from pydantic_settings import BaseSettings
load_dotenv()
config_parser = configparser.ConfigParser()


class Settings(BaseSettings):
    ENVIRONMENT: Literal['dev', 'test', 'prod']
    DEBUG: bool = False
    ENABLE_CORS: bool = True
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    # session
    CSRF_ENABLED: bool = True
    TOKEN_SECRET_KEY: str = "+5_fsR|+p2I=?VmF%A4V('@{Ovv59z"
    TRACE_ID_REQUEST_HEADER_KEY: str = 'X-Request-ID'
    SYNC_LOG_TO_DB: bool = False
    # Token
    TOKEN_ALGORITHM: str = 'HS256'
    TOKEN_EXPIRE_SECONDS: int = 60 * 60 * 24 * 10
    TOKEN_REFRESH_EXPIRE_SECONDS: int = 60 * 60 * 24 * 7
    TOKEN_REDIS_PREFIX: str = 'photinia_token'
    TOKEN_REFRESH_REDIS_PREFIX: str = 'Photinia_refresh_token'
    TOKEN_REQUEST_PATH_EXCLUDE: list[str] = [
        'api/auth/login',
    ]

    # FastAPI
    FASTAPI_API_PATH: str = '/api'
    FASTAPI_TITLE: str = 'Photinia backend api'
    FASTAPI_VERSION: str = '0.0.1'
    FASTAPI_DESCRIPTION: str = 'Web API for Photinia'
    FASTAPI_DOCS_URL: str | None = f'/docs'
    FASTAPI_REDOCS_URL: str | None = f'/redocs'
    FASTAPI_OPENAPI_URL: str | None = f'/openapi'

    @model_validator(mode='before')
    @classmethod
    def validate_openapi_url(cls, values):
        if values['ENVIRONMENT'] == "prod":
            values['FASTAPI_OPENAPI_URL'] = None
        return values

    JWT_USER_REDIS_PREFIX: str = 'app:user'
    JWT_USER_REDIS_EXPIRE_SECONDS: int = 60 * 60 * 24 * 7

    MAX_ERROR_LOGIN_NUM: int = 5
    LOGIN_LOCK_TIME_UNIT: str = "min"
    LOGIN_LOCK_TIME_VALUE: int = 30

    # DateTime
    DATETIME_TIMEZONE: str = 'Asia/Shanghai'
    DATETIME_FORMAT: str = '%Y-%m-%d %H:%M:%S'

    # Middleware
    MIDDLEWARE_CORS: bool = True
    MIDDLEWARE_ACCESS: bool = True

    CORS_ALLOWED_ORIGINS: list[str] = [
        'http://127.0.0.1:8000',
        'http://localhost:5173'
    ]
    CORS_EXPOSE_HEADERS: list[str] = [
        TRACE_ID_REQUEST_HEADER_KEY
    ]
    CORS_ALLOW_HEADERS: list[str] = [
        "authorization"
    ]

    TMP_FOLDER: str = os.getenv(
        "TMP_FOLDER", os.path.join(tempfile.gettempdir(), "pm"))
    PREVIEW_FOLDER: str = os.getenv(
        "PREVIEW_FOLDER", os.path.join(os.getcwd(), "previews"))
    ATTACHMENT_FILE_FOLDER: str = os.getenv(
        "ATTACHMENT_FILE_FOLDER", os.path.join(os.getcwd(), "attachment_files"))
    ATTACHMENT_UPLOAD_FILE_SIZE_LIMIT: int = os.getenv(
        "ATTACHMENT_UPLOAD_FILE_SIZE_LIMIT", 2*1024*1024)  # 2M
    ATTACHMENT_UPLOAD_FILE_EXPIRED_DAYS: int = os.getenv(
        "ATTACHMENT_UPLOAD_FILE_EXPIRED_DAYS", 30)

    RUN_LOG_ON: bool = True
    DAILY_TASK_TRIGGER_TIME: str = "00:30:00"
    ATTACHMENT_CLEAR_TRIGGER_TIME: str = "00:40:00"

    CAPTCHA_LOGIN_REDIS_PREFIX: str = 'login_captcha'
    CAPTCHA_LOGIN_EXPIRE_SECONDS: int = 60 * 5

    REDIS_HOST: str = os.getenv("REDIS_HOST", "127.0.0.1")
    REDIS_PORT: int = os.getenv("REDIS_PORT", 6379)
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    REDIS_DATABASE: int = os.getenv("REDIS_DATABASE", 0)
    REDIS_TIMEOUT: int = 5

    RBAC_PERMISSION_EXCLUDE: List[str] = []
    OPERA_LOG_EXCLUDES: List[str] = [
        '/favicon.ico',
        "/api/auth/login",
        "/api/auth/get_captcha",
        FASTAPI_DOCS_URL,
        FASTAPI_REDOCS_URL,
        FASTAPI_OPENAPI_URL,
    ]


settings = Settings()
logger.info(f"{settings.ENVIRONMENT=}")
