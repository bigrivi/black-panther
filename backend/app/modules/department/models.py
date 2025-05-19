from datetime import datetime
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship, BIGINT
from app.common.model import BaseMixin


class DepartmentBase(SQLModel):
    name: str
    sort: Optional[int] = Field(default=0)
    leader: Optional[str] = Field(default=None)
    parent_id: Optional[int] = Field(
        default=None,
        foreign_key="department.id",
        sa_type=BIGINT
    )


class Department(DepartmentBase, BaseMixin, table=True):
    path: Optional[str] = Field(default=None, index=True, unique=True)
    parent: "Department" = Relationship(
        sa_relationship_kwargs={"uselist": False, "remote_side": 'Department.id', "viewonly": True, "lazy": "noload"})


class DepartmentPublic(DepartmentBase):
    id: Optional[int]
    path: str
    valid_state: Optional[bool] = Field(default=None)
    children: Optional[List["DepartmentPublic"]] = None
    created_at: Optional[datetime] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(DepartmentBase):
    pass
