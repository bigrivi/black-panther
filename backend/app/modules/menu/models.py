from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from enum import IntEnum
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime, INTEGER, String, BIGINT
from app.enums import IntEnumField
from app.common.model import BaseMixin
from app.common.model.link import RoleMenuLink
if TYPE_CHECKING:
    from app.modules.role.models import Role


class MenuTypeEnum(IntEnum):
    DIR = 0
    MENU = 1
    BUTTON = 2


class MenuBase(SQLModel):
    name: str
    title: str
    level: Optional[int] = Field(default=0)
    sort: Optional[int] = Field(default=0)
    remark: Optional[str] = Field(default=None)
    icon: Optional[str] = Field(default=None)
    path: Optional[str] = Field(default=None)
    menu_type: MenuTypeEnum | None = IntEnumField(
        MenuTypeEnum, default=None)
    perm_code: Optional[str] = Field(default=None)
    show: Optional[bool] = Field(default=True)
    parent_id: Optional[int] = Field(
        default=None,
        foreign_key="menu.id",
        sa_type=BIGINT
    )


class Menu(MenuBase, BaseMixin, table=True):
    parent: "Menu" = Relationship(
        back_populates='children',
        sa_relationship_kwargs={"uselist": False, "remote_side": 'Menu.id', "viewonly": True, "lazy": "noload"})
    children: Optional[List["Menu"]] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={
            "lazy": "noload",
            "join_depth": 100,
            "viewonly": True,
            "order_by": "Menu.sort.asc()",
            "cascade": "delete",
        },
    )
    roles: List["Role"] = Relationship(
        back_populates="menus", link_model=RoleMenuLink)


class MenuPublic(MenuBase):
    id: Optional[int]
    valid_state: Optional[bool] = Field(default=None)
    children: Optional[List["MenuPublic"]] = None


class MenuCreate(MenuBase):
    pass


class MenuUpdate(MenuBase):
    pass
