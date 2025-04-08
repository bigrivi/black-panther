from typing import Optional, List, Any, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime
from app.common.model import BaseMixin


class PostBase(SQLModel):
    name: str
    code: str
    description: Optional[str] = Field(default=None)


class Post(PostBase, BaseMixin, table=True):
    pass


class PostPublic(PostBase):
    id: Optional[int]


class PostCreate(PostBase):
    pass


class PostUpdate(PostBase):
    pass
