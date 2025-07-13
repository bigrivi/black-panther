from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Relationship, BIGINT
from app.common.model import BaseMixin
from app.common.model.field import Field
from app.enums import IntNameEnum
from app.modules.department.models import Department, DepartmentPublic
from .detail.models import ToyDetail, ToyDetailCreate, ToyDetailPublic


class Select1Enum(IntNameEnum):
    option1 = 1, "option1"
    option2 = 2, "option2"
    option3 = 3, "option3"


class ToyBase(SQLModel):
    tetx1: str = Field(value_type="text",
                       title="text1", description="description")
    tetx2: str = Field(default=None, value_type="text", title="text2")
    textarea1: Optional[str] = Field(
        default=None, value_type="textarea", title="textarea1")
    switch1: Optional[bool] = Field(
        default=True, value_type="switch", title="switch1", description="description")
    checkbox1: Optional[bool] = Field(
        default=True, value_type="checkbox", title="checkbox1", description="description")
    select1: Select1Enum | None = Field(
        enum=Select1Enum, default=Select1Enum.option1, value_type="select", title="select1", description="select1_description")
    department_id: Optional[int] = Field(
        default=None, title="department", value_type="treeSelect", sa_type=BIGINT, reference="department", foreign_key="department.id", hide_in_list=True, description="department_description"
    )


class Toy(ToyBase, BaseMixin, table=True):
    department: Optional[Department] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
    )
    details: List[ToyDetail] = Relationship(
        sa_relationship_kwargs={
            "uselist": True,
            "cascade": "all, delete-orphan",
            "lazy": "noload"
        })


class ToyPublic(ToyBase):
    id: Optional[int]
    department: Optional[DepartmentPublic] = Field(
        reference="department", title="department", value_type="treeSelect")
    created_at: Optional[datetime] = None
    details: List[ToyDetailPublic] = None


class ToyCreate(ToyBase):
    details: List[ToyDetailCreate] = Field(
        title="details", value_type="listTable", description="detail description")


class ToyUpdate(ToyBase):
    details: List[ToyDetailCreate] = None
