from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Relationship
from app.common.model import BaseMixin
from app.common.model.field import Field
from app.enums import IntNameEnum
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
        default=True, value_type="switch", title="switch1")
    checkbox1: Optional[bool] = Field(
        default=True, value_type="checkbox", title="checkbox1")
    select1: Select1Enum | None = Field(
        enum=Select1Enum, default=Select1Enum.option1, value_type="select", title="select1")


class Toy(ToyBase, BaseMixin, table=True):
    details: List[ToyDetail] = Relationship(
        sa_relationship_kwargs={
            "uselist": True,
            "cascade": "all, delete-orphan",
            "lazy": "noload"
        })


class ToyPublic(ToyBase):
    id: Optional[int]
    created_at: Optional[datetime] = None
    details: List[ToyDetailPublic] = None


class ToyCreate(ToyBase):
    details: List[ToyDetailCreate] = Field(
        title="details", value_type="listTable", description="detail description")


class ToyUpdate(ToyBase):
    details: List[ToyDetailCreate] = None
