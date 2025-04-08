import os
import aiofiles
from filestorage import store
from datetime import datetime
import time
from uuid import uuid4
from app.config.settings import settings
from filestorage.handlers import AsyncLocalFileHandler
store['pictures'].handler = AsyncLocalFileHandler(
    base_path=f"{settings.PREVIEW_FOLDER}/pictures/", auto_make_dir=True)
store['attachment_file'].handler = AsyncLocalFileHandler(
    base_path=f"{settings.ATTACHMENT_FILE_FOLDER}/", auto_make_dir=True)

PICTURES_STORE = store['pictures']
ATTACHMENT_FILE_STORE = store['attachment_file']


def make_key(prefix, id):
    return f"{prefix}-{id}"


def store_path(filename):
    folder_one = filename.split("-")[0]
    file_name = "-".join(filename.split("-")[1:])
    folder_two = file_name[:3]
    folder_three = file_name[3:6]

    return os.path.join(
        folder_one, folder_two, folder_three
    )


async def add_picture(prefix, file_id, path):
    key = make_key(prefix, file_id)
    folder = PICTURES_STORE / store_path(key)
    async with aiofiles.open(path, "rb") as f:
        await folder.async_save_file(file_id, f)


def gen_file_name():
    str_timestamp = time.strftime("%Y%m%d%H%M%S", time.localtime(time.time()))
    return str(uuid4()).replace('-', '')+str_timestamp


async def add_attachment_file(
    file_contents: bytes,
    file_name: str | None = None,
    extension: str | None = None
):
    store_dir = datetime.now().strftime("%Y%m%d")
    folder = ATTACHMENT_FILE_STORE / store_dir
    if not file_name:
        file_name = gen_file_name()+"."+extension
    await folder.async_save_data(file_name, file_contents)
    return store_dir+"/"+file_name


def get_local_attachment_file_path(file_path: str):
    return os.path.join(
        ATTACHMENT_FILE_STORE.handler.base_path, file_path)


def remove_attachment_file(file_path):
    file_path = get_local_attachment_file_path(file_path)
    if os.path.exists(file_path):
        os.remove(file_path)


def get_local_picture_path(prefix: str, id: str):
    key = make_key(prefix, id)
    folder = PICTURES_STORE / store_path(key)
    return os.path.join(PICTURES_STORE.handler.base_path, folder.path[0], id.replace("-", "_"))
