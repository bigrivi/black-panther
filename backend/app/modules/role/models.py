from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime
from app.common.model import BaseMixin
from app.common.model.link import RoleActionLink
from app.modules.resource.action.models import ActionPublic, Action


class RoleBase(SQLModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = Field(default=None)


class Role(RoleBase, BaseMixin, table=True):
    actions: List["Action"] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
        link_model=RoleActionLink
    )


class RolePublic(RoleBase):
    id: Optional[int]
    actions: Optional[List[ActionPublic]] = None
    valid_state: Optional[bool] = None
    created_at: datetime = None


class RolePublicWithoutActions(RoleBase):
    id: Optional[int]
    valid_state: Optional[bool] = None
    created_at: datetime = None


class RoleCreate(RoleBase):
    pass


class RoleUpdate(RoleBase):
    pass
