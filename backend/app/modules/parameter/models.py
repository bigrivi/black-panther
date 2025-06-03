from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel
from app.common.model import BaseMixin
from sqlalchemy.sql import text


class ParameterBase(SQLModel):
    name: str
    key: str
    value: str
    description: Optional[str] = Field(default=None)
    is_system: Optional[bool] = Field(default=True, sa_column_kwargs={
        "server_default": text("1")})


class Parameter(ParameterBase, BaseMixin, table=True):
    pass


class ParameterPublic(ParameterBase):
    id: Optional[int]
    created_at: Optional[datetime] = None


class ParameterCreate(ParameterBase):
    pass


class ParameterUpdate(ParameterBase):
    pass
