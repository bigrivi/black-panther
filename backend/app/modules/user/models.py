from typing import Optional, List
from datetime import datetime
from sqlalchemy.dialects.mysql import BIGINT
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime, String, BIGINT
from app.common.model import BaseMixin
from app.modules.post.models import Post, PostPublic
from app.modules.role.models import Role, RolePublic
from app.utils.common import find


class UserRoleLink(SQLModel, table=True):
    __tablename__ = "user_role_link"
    id: int = Field(
        sa_type=BIGINT,
        primary_key=True,
        index=True,
        nullable=False,
    )
    user_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="user.id"
    )
    role_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="role.id"
    )


class UserPostLink(SQLModel, table=True):
    __tablename__ = "user_post_link"
    id: int = Field(
        sa_type=BIGINT,
        primary_key=True,
        index=True,
        nullable=False,
    )
    user_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="user.id"
    )
    post_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="post.id"
    )


class UserBase(SQLModel):
    is_active: Optional[bool] = Field(default=True)
    is_superuser: Optional[bool] = Field(default=False)
    login_name: str
    user_name: str
    email: Optional[str] = None


class User(UserBase, BaseMixin, table=True):
    password: str
    dept_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="dept.id"
    )
    posts: List["Post"] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
        link_model=UserPostLink
    )
    roles: List["Role"] = Relationship(
        sa_relationship_kwargs={"lazy": "noload"},
        link_model=UserRoleLink
    )
    role_links: List[UserRoleLink] = Relationship(
        sa_relationship_kwargs={"lazy": "noload", "viewonly": True}
    )

    last_ip: Optional[str] = None
    last_login_date: datetime = Field(
        default=None, sa_column=Column(DateTime(timezone=True), nullable=True)
    )
    num_error_login: Optional[int] = None
    last_error_login: datetime = Field(
        default=None, sa_column=Column(DateTime(timezone=True), nullable=True)
    )
    last_pwd_modify_date: datetime = Field(
        default=None, sa_column=Column(DateTime(timezone=True), nullable=True)
    )

    def exist_role(self, role_code: str):
        return find(self.roles, lambda x: x.code == role_code) is not None


class UserPublic(UserBase):
    id: int
    roles: List[RolePublic] = None


class CurrentUser(UserBase):
    id: int
    roles: List[RolePublic] = None
    posts: List[PostPublic] = None


class UserCreate(UserBase):
    password: str
    roles: Optional[List[int]] = None
    posts: Optional[List[int]] = None


class UserUpdate(UserBase):
    password: Optional[str] = None
    valid_state: Optional[bool] = None
    roles: Optional[List[int]] = None
    posts: Optional[List[int]] = None
