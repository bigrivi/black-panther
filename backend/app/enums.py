from enum import IntEnum

from enum import Enum as PyEnum
from typing import Any
from sqlalchemy import TypeDecorator
from sqlalchemy.dialects.mysql import TINYINT
from sqlmodel import Field


class IntNameEnum(IntEnum):
    name_: str

    def __new__(cls, value, name):
        member = int.__new__(cls)
        member._value_ = value
        member.name_ = name
        return member

    def __eq__(self, other):
        if not isinstance(other, PyEnum):
            return NotImplemented
        return self.value == other.value

    def __ne__(self, other):
        if not isinstance(other, PyEnum):
            return NotImplemented
        return self.value != other.value

    @classmethod
    def of_name(cls, name):
        for item in cls:
            if item.name_ == name:
                return item
        return None


def IntEnumField(enum: Any, **kwargs: Any) -> Any:
    if "sa_type" in kwargs:
        raise ValueError("sa_type is not allowed for EnumStrField")

    return Field(
        sa_type=IntEnumType(enum_class=enum),  # type: ignore
        **kwargs,
    )


class IntEnumType(TypeDecorator):

    impl = TINYINT
    cache_ok = True

    def __init__(self, enum_class: type[PyEnum] | None = None, *args, **kwargs) -> None:
        self.enum_class = enum_class
        super().__init__(*args, **kwargs)

    def process_bind_param(self, value: PyEnum | None, dialect: Any) -> str | None:
        if value is None:
            return None
        elif isinstance(value, PyEnum):
            return value.value
        elif isinstance(value, str):
            self.enum_class(int(value))
            return value
        elif isinstance(value, int):
            self.enum_class(value)
            return value
        return value.value

    def process_result_value(self, value: str, dialect: Any) -> PyEnum | None:
        if value is not None:
            return self.enum_class(value)
        return None
