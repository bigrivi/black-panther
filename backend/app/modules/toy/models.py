from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Relationship, BIGINT
from app.common.model import BaseMixin
from app.common.model.field import Field
from app.common.model.helper import partial_model
from app.enums import IntNameEnum
from app.modules.department.models import Department, DepartmentPublic
from app.modules.position.models import Position, PositionPublic
from .detail.models import ToyDetail, ToyDetailCreate, ToyDetailPublic
from app.modules.role.models import Role, RolePublicWithoutActions


class ToyRoleLink(SQLModel, table=True):
    __tablename__ = "toy_role_link"
    id: int = Field(
        sa_type=BIGINT,
        primary_key=True,
        index=True,
        nullable=False,
    )
    toy_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="toy.id"
    )
    role_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="role.id"
    )


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
        default=None,
        title="department",
        value_type="referenceNode",
        sa_type=BIGINT,
        reference="department",
        hide_in_list=True,
        foreign_key="department.id",
        description="department_description"
    )
    position_id: int = Field(
        foreign_key="position.id",
        title="position",
        value_type="reference",
        sa_type=BIGINT,
        reference="position",
        hide_in_list=True,
        priority=10
    )


class Toy(ToyBase, BaseMixin, table=True):
    department: Optional[Department] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
    )
    position: Optional[Position] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
    )
    details: List[ToyDetail] = Relationship(
        sa_relationship_kwargs={
            "uselist": True,
            "cascade": "all, delete-orphan",
            "lazy": "noload"
        })
    roles: List["Role"] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
        link_model=ToyRoleLink
    )


class ToyPublic(ToyBase):
    id: Optional[int]
    department: Optional[DepartmentPublic] = Field(
        title="department",
        value_type="referenceNode",
        reference="department",
        search_key="department_id"
    )
    position: Optional[PositionPublic] = Field(
        title="position",
        value_type="reference",
        reference="position",
        search_key="position_id",
        priority=10
    )
    created_at: Optional[datetime] = None
    details: List[ToyDetailPublic] = None
    roles: List[RolePublicWithoutActions] = Field(
        title="roles",
        value_type="referenceArray",
        reference="role",
        priority=9
    )


class ToyCreate(ToyBase):
    roles: Optional[List[int]] = Field(
        default=None,
        title="roles",
        value_type="referenceArray",
        reference="role",
        priority=9
    )
    details: List[ToyDetailCreate] = Field(
        title="details", value_type="listTable", description="detail description")


@partial_model
class ToyUpdate(ToyBase):
    roles: Optional[List[int]] = Field(
        default=None,
        title="roles",
        value_type="referenceArray",
        reference="role",
        priority=9
    )
    details: List[ToyDetailCreate] = None
