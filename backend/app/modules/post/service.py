from typing import List
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from .models import Post


class PostService(ServiceBase[Post]):
    def __init__(self):
        super().__init__(Post)


post_service = PostService()
