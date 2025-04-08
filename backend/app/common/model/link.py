from typing import Optional, List, Any
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime, BIGINT
from datetime import datetime
from sqlalchemy.sql import func, text


class RoleMenuLink(SQLModel, table=True):
    __tablename__ = "role_menu_link"
    role_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="role.id", primary_key=True
    )
    menu_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="menu.id", primary_key=True
    )
