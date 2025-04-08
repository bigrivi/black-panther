from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from app.config.settings import settings


engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=False,
    pool_size=50,
    pool_pre_ping=True,
    pool_recycle=600,
    max_overflow=10
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


DBBase = declarative_base()
