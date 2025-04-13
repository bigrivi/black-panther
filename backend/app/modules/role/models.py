from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime
from app.common.model import BaseMixin
from app.common.model.link import RoleMenuLink
from app.modules.menu.models import MenuPublic
if TYPE_CHECKING:
    from app.modules.menu.models import Menu


class RoleBase(SQLModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = Field(default=None)


class Role(RoleBase, BaseMixin, table=True):
    menus: List["Menu"] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
        back_populates="roles",
        link_model=RoleMenuLink
    )


class RolePublic(RoleBase):
    id: Optional[int]
    menus: Optional[List[MenuPublic]] = None
    valid_state: Optional[bool] = None
    created_at: datetime = None


class RoleCreate(RoleBase):
    pass


class RoleUpdate(RoleBase):
    pass
