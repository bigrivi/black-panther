from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Relationship, Column, DateTime, BIGINT
from app.common.model import BaseMixin
from app.common.model.field import Field
from app.enums import IntNameEnum


class Select2Enum(IntNameEnum):
    option1 = 1, "option10"
    option2 = 2, "option20"
    option3 = 3, "option30"


class ToyDetailBase(SQLModel):
    tetx1: str = Field(value_type="text",
                       title="text1", description="description1")
    tetx2: str = Field(default=None, value_type="text", title="text2")

    switch1: Optional[bool] = Field(
        default=True, value_type="switch", title="switch1")
    checkbox1: Optional[bool] = Field(
        default=True, value_type="checkbox", title="checkbox1")
    select1: Select2Enum | None = Field(
        enum=Select2Enum, default=None, value_type="select", title="select1")


class ToyDetail(ToyDetailBase, BaseMixin, table=True):
    __tablename__ = "toy_detail"
    toy_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="toy.id"
    )


class ToyDetailPublic(ToyDetailBase):
    id: Optional[int]


class ToyDetailCreate(ToyDetailBase):
    pass


class ToyDetailUpdate(ToyDetailBase):
    pass
