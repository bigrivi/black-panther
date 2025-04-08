from typing import AsyncGenerator
from app.database.core import SessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from app.middleware.fastapi_sqlalchemy import db


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


async def get_db_session():
    yield db.session
