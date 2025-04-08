from typing import Optional, List, Any
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime, String, BIGINT
from datetime import datetime
from sqlalchemy.sql import func, text


class BaseMixin(SQLModel):
    id: int = Field(
        sa_type=BIGINT,
        primary_key=True,
        index=True,
        nullable=False,
    )
    valid_state: Optional[bool] = Field(default=True, sa_column_kwargs={
                                        "server_default": text("1")})
    created_at: datetime | None = Field(sa_type=DateTime(
        timezone=True), default=datetime.now(), sa_column_kwargs={"server_default": func.now()}, nullable=False)
    updated_at: datetime | None = Field(
        default=datetime.now(), nullable=True, sa_type=DateTime(timezone=True), sa_column_kwargs={"server_default": text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')}
    )
    expiry_at: datetime | None = Field(
        default=None, nullable=True
    )
