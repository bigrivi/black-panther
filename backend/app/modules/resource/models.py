from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime
from app.common.model import BaseMixin
from .action.models import Action, ActionCreate, ActionPublic


class ResourceBase(SQLModel):
    name: str
    key: str
    description: Optional[str] = Field(default=None)


class Resource(ResourceBase, BaseMixin, table=True):
    actions: List[Action] = Relationship(
        sa_relationship_kwargs={"uselist": True,
                                "order_by": "Action.id.asc()",
                                "cascade": "all, delete-orphan",
                                "lazy": "noload"})


class ResourcePublic(ResourceBase):
    id: Optional[int]
    actions: List[ActionPublic] = None
    valid_state: Optional[bool]
    created_at: Optional[datetime] = None


class ResourceCreate(ResourceBase):
    actions: List[ActionCreate] = None


class ResourceUpdate(ResourceBase):
    actions: List[ActionCreate] = None
