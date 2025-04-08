from typing import Optional, List, Any, TYPE_CHECKING
from sqlmodel import Field, SQLModel, BIGINT
from sqlalchemy import text
from app.common.model import BaseMixin


class AttachmentFileBase(SQLModel):
    name: str = None
    size: int | None = None
    extension: str | None = None
    mime_type: str | None = None
    path: str | None = None
    author_id: Optional[int] = Field(
        default=None, sa_type=BIGINT, foreign_key="user.id"
    )
    is_used: Optional[bool] = Field(default=False, sa_column_kwargs={
        "server_default": text("0")})


class AttachmentFile(AttachmentFileBase, BaseMixin, table=True):
    __tablename__ = "attachment_file"


class AttachmentFilePublic(AttachmentFileBase):
    id: Optional[int]
