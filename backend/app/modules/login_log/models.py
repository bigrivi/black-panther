from typing import Optional, List, Dict
from datetime import datetime
from sqlmodel import Field, SQLModel, BIGINT
from sqlalchemy.dialects.mysql import BIGINT
from app.common.model import BaseMixin


class LoginLogBase(SQLModel):
    trace_id: str
    user_name: str | None = None
    user_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="user.id"
    )
    ip: str
    user_agent: str
    os: str | None = None
    browser: str | None = None
    device: str | None = None
    msg: str | None = None
    login_time: datetime
    status: int = Field(default=1)


class LoginLog(LoginLogBase, BaseMixin, table=True):
    __tablename__ = "sys_login_log"


class LoginLogPublic(LoginLogBase):
    id: int
