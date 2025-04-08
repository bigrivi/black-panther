from sqlmodel import SQLModel
from app.extensions import logger
from .core import engine


async def init_db():
    logger.info("init db")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
