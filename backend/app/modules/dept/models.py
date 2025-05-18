from datetime import datetime
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship, BIGINT
from app.common.model import BaseMixin


class DeptBase(SQLModel):
    name: str
    sort: Optional[int] = Field(default=0)
    leader: Optional[str] = Field(default=None)
    parent_id: Optional[int] = Field(
        default=None,
        foreign_key="dept.id",
        sa_type=BIGINT
    )


class Dept(DeptBase, BaseMixin, table=True):
    path: Optional[str] = Field(default=None, index=True, unique=True)
    parent: "Dept" = Relationship(
        sa_relationship_kwargs={"uselist": False, "remote_side": 'Dept.id', "viewonly": True, "lazy": "noload"})


class DeptPublic(DeptBase):
    id: Optional[int]
    valid_state: Optional[bool] = Field(default=None)
    children: Optional[List["DeptPublic"]] = None
    created_at: Optional[datetime] = None


class DeptCreate(DeptBase):
    pass


class DeptUpdate(DeptBase):
    pass
