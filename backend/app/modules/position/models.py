from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime
from app.common.model import BaseMixin


class PositionBase(SQLModel):
    name: str
    code: str
    description: Optional[str] = Field(default=None)


class Position(PositionBase, BaseMixin, table=True):
    pass


class PositionPublic(PositionBase):
    id: Optional[int]
    created_at: Optional[datetime] = None
    valid_state: Optional[bool] = None


class PositionCreate(PositionBase):
    pass


class PositionUpdate(PositionBase):
    pass
