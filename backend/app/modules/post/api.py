from typing import List, Dict, Annotated
from fastapi import APIRouter, Depends, Request, Path
from better_crud import crud
from .models import PostCreate, PostUpdate, PostPublic
from .service import PostService
router = APIRouter()


@crud(
    router,
    feature="post",
    dto={"create": PostCreate, "update": PostUpdate},
    serialize={"base": PostPublic},
)
class PostController():
    service: PostService = Depends(PostService)
