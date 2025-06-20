from typing import List, Optional
from pydantic import BaseModel, Field
from sqlmodel import SQLModel

from app.common.model.field import ValueType


class FieldOptionModel(SQLModel):
    label: str
    value: str | int


class FieldSchemaModel(SQLModel):
    name: str
    label: str
    required:Optional[bool] = False
    value_type: ValueType
    description: Optional[str] = None
    options: Optional[List[FieldOptionModel]] = None
