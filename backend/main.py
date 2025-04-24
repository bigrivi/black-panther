from fastapi.staticfiles import StaticFiles
from textwrap import dedent
from app.extensions import redis_client, logger, scheduler_service
from app.registrar import register_app
from app.database.init_db import init_db
from app.common.response import BaseResponse
from fastapi import FastAPI
from app.config.settings import settings
from contextlib import asynccontextmanager
import uvicorn


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info(
        dedent("""\n
            /$$$$$$$$                   /$$      /$$$$$$  /$$$$$$$  /$$$$$$
            | $$_____/                  | $$     /$$__  $$| $$__  $$|_  $$_/
            | $$    /$$$$$$   /$$$$$$$ /$$$$$$  | $$  | $$| $$  | $$  | $$
            | $$$$$|____  $$ /$$_____/|_  $$_/  | $$$$$$$$| $$$$$$$/  | $$
            | $$__/ /$$$$$$$|  $$$$$$   | $$    | $$__  $$| $$____/   | $$
            | $$   /$$__  $$ |____  $$  | $$ /$$| $$  | $$| $$        | $$
            | $$  |  $$$$$$$ /$$$$$$$/  |  $$$$/| $$  | $$| $$       /$$$$$$
            |__/   |_______/|_______/    |___/  |__/  |__/|__/      |______/
        """)
    )
    await scheduler_service.start()
    await redis_client.open()
    if settings.ENVIRONMENT == "dev":
        await init_db()
    logger.info("Application Started")
    # Shutdown
    yield
    await redis_client.close()
    logger.info("Application shutdown")


app = FastAPI(
    title=settings.FASTAPI_TITLE,
    description=settings.FASTAPI_DESCRIPTION,
    version=settings.FASTAPI_VERSION,
    lifespan=lifespan,
    default_response_class=BaseResponse,
    openapi_url=settings.FASTAPI_OPENAPI_URL
)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/health", status_code=200, include_in_schema=False)
async def health_check():
    """This is the health check endpoint"""
    return {"status": "ok"}

register_app(app)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1",
                reload=True, port=8000, log_level="info")
