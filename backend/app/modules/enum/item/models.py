from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime, BIGINT
from app.common.model import BaseMixin
if TYPE_CHECKING:
    from app.modules.enum.models import Enum


class EnumItemBase(SQLModel):
    name: str
    value: str
    sort: int
    description: Optional[str] = Field(default=None)


class EnumItem(EnumItemBase, BaseMixin, table=True):
    __tablename__ = "enum_item"
    enum_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="enum.id"
    )
    enum: "Enum" = Relationship(
        sa_relationship_kwargs={"uselist": False, "viewonly": True, "lazy": "noload"})


class EnumItemPublic(EnumItemBase):
    id: Optional[int]
    valid_state: Optional[bool] = None
    created_at: Optional[datetime] = None


class EnumItemCreate(EnumItemBase):
    valid_state: Optional[bool] = None


class EnumItemUpdate(EnumItemBase):
    valid_state: Optional[bool] = None
