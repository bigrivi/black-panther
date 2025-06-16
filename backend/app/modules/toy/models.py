from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Relationship, Column, DateTime
from app.common.model import BaseMixin
from app.common.model.field import Field
from app.enums import IntNameEnum


class Select1Enum(IntNameEnum):
    option1 = 1, "option1"
    option2 = 2, "option2"
    option3 = 3, "option3"


class ToyBase(SQLModel):
    tetx1: str = Field(default=None, widget="text",
                       label="text1", description="description1")
    tetx2: str = Field(default=None, widget="text", label="text2")
    textarea1: Optional[str] = Field(
        default=None, widget="textarea", label="textarea1")
    switch1: Optional[bool] = Field(
        default=None, widget="switch", label="switch1")
    select1: Select1Enum | None = Field(
        enum=Select1Enum, default=None, widget="select", label="select1")


class Toy(ToyBase, BaseMixin, table=True):
    pass


class ToyPublic(ToyBase):
    id: Optional[int]
    created_at: Optional[datetime] = None


class ToyCreate(ToyBase):
    pass


class ToyUpdate(ToyBase):
    pass
