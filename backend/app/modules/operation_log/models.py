from typing import Optional, List, Dict
from datetime import datetime
from sqlmodel import Field, SQLModel, BIGINT, JSON, Column
from sqlalchemy.dialects.mysql import BIGINT
from app.common.model import BaseMixin


class OperationLogBase(SQLModel):
    trace_id: str
    user_name: str | None = None
    user_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="user.id"
    )
    method: str
    title: str | None
    path: str
    ip: str
    user_agent: str
    os: str | None = None
    browser: str | None = None
    device: str | None = None
    args: Optional[Dict] = Field(default_factory=dict, sa_column=Column(JSON))
    code: str
    msg: str | None = None
    cost_time: float
    operation_time: datetime
    status: int = Field(default=1)


class OperationLog(OperationLogBase, BaseMixin, table=True):
    __tablename__ = "sys_operation_log"


class OperationLogPublic(OperationLogBase):
    id: int


class OperationLogCreate(OperationLogBase):
    pass
