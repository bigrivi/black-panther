from typing import Optional, List, Any
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime, BIGINT
from datetime import datetime


class RoleActionLink(SQLModel, table=True):
    __tablename__ = "role_action_link"
    id: int = Field(
        sa_type=BIGINT,
        primary_key=True,
        index=True,
        nullable=False,
    )
    role_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="role.id"
    )
    action_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="action.id"
    )
