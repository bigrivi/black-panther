import logging
import os
from loguru import logger
import sys
from asgi_correlation_id.context import correlation_id
from app.config.settings import settings

root_dir_path = os.path.abspath('.')


def correlation_id_filter(record):
    record['correlation_id'] = correlation_id.get("-")
    return record['correlation_id']


def formatter(record):
    path = os.path.abspath(record["file"].path)
    record["extra"]["abspath"] = path.replace(root_dir_path, "").lstrip("/")
    return "[threadId = {thread}] <green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> [<level>{level}</level>] [<cyan>{extra[abspath]}:{line}</cyan>] [{correlation_id}] - <level>{message}</level>\n"


logger.remove(0)  # remove the configuration for the default handler
logger.add(sys.stdout, level=logging.DEBUG,
           format=formatter, enqueue=False, colorize=True, filter=correlation_id_filter)
if settings.ENVIRONMENT != "dev":
    logger.add("logs/business/business_{time:YYYY-MM-DD}.log",
               format=formatter, rotation="00:00", retention=f"30 days", filter=correlation_id_filter)
    logger.add(sys.stderr, level=logging.ERROR,
               format=formatter, enqueue=False, colorize=True, filter=correlation_id_filter)
