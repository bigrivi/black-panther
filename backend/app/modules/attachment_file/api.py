from typing import List, Dict, Union
from fastapi import APIRouter, Depends, Request, Path, UploadFile, File
from fastapi.responses import StreamingResponse
import os
from urllib.parse import quote
from better_crud import crud
from app.common.security.jwt import DependsJwtAuth
from app.middleware.fastapi_sqlalchemy import db
from app.config.settings import settings
from .service import AttachmentFileService
from app.common.response import response_base, ResponseModel
from app.extensions.file_storage import get_local_attachment_file_path
from .models import AttachmentFilePublic
from app.exception.errors import NotFoundError
from .scheduled import clear_un_used_attachment

router = APIRouter()


@crud(
    router,
    feature="attachment_file",
    routes={
        "only": ["get_many", "get_one"]
    },
    serialize={"base": AttachmentFilePublic}
)
class AttachmentFileController():
    service: AttachmentFileService = Depends(AttachmentFileService)

    @router.post("/upload", dependencies=[DependsJwtAuth], response_model=ResponseModel[AttachmentFilePublic])
    async def upload_file(self, request: Request, file: UploadFile = File(...)):
        attachment_file = await self.service.upload(file)
        return response_base.success(data=attachment_file)

    @router.get("/{id}/download", dependencies=[DependsJwtAuth])
    async def download(self, request: Request, id: int = Path(...)):
        attachment = await self.service.get_by_id(id)
        if not attachment:
            raise NotFoundError()
        file_path = get_local_attachment_file_path(attachment.path)
        mime_type = attachment.mime_type

        def iterfile():
            with open(file_path, mode="rb") as file_like:
                yield from file_like
        content_disposition_filename = quote(attachment.name)
        headers = {'Content-Disposition': 'attachment; filename="' +
                   content_disposition_filename+'"', "content-type": mime_type}
        try:
            os.stat(file_path)
        except FileNotFoundError as error:
            raise NotFoundError(msg="File not found")
        return StreamingResponse(iterfile(), headers=headers, media_type=mime_type)
