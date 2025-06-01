from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime
from app.common.model import BaseMixin
from .item.models import EnumItem, EnumItemCreate, EnumItemPublic, EnumItemUpdate


class EnumBase(SQLModel):
    name: str
    key: str
    description: Optional[str] = Field(default=None)


class Enum(EnumBase, BaseMixin, table=True):
    items: List[EnumItem] = Relationship(
        sa_relationship_kwargs={"uselist": True,
                                "order_by": "EnumItem.sort.asc()",
                                "cascade": "all, delete-orphan",
                                "primaryjoin": 'and_(remote(foreign(EnumItem.enum_id))==Enum.id,or_(remote(foreign(EnumItem.expiry_at)) > func.now(),remote(foreign(EnumItem.expiry_at == None))))',
                                "lazy": "noload"})


class EnumPublic(EnumBase):
    id: Optional[int]
    items: List[EnumItemPublic] = None
    valid_state: Optional[bool]
    created_at: Optional[datetime] = None


class EnumCreate(EnumBase):
    items: List[EnumItemCreate] = None


class EnumUpdate(EnumBase):
    items: List[EnumItemUpdate] = None
