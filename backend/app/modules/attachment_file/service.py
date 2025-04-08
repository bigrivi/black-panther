import os
from urllib.parse import quote
from fastapi import UploadFile
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from datetime import datetime
from app.extensions import logger
from app.config.settings import settings
from app.exception import errors
from .models import AttachmentFile
from app.utils.common import hum_convert
from app.extensions.file_storage import add_attachment_file, remove_attachment_file
from app.modules.user import get_current_user


class AttachmentFileService(ServiceBase[AttachmentFile]):
    def __init__(self):
        super().__init__(AttachmentFile)

    async def upload(self, file: UploadFile):
        file_contents = file.file.read()
        extension = os.path.splitext(file.filename)[-1][1:]
        file_size = len(file_contents)
        limit_size = settings.ATTACHMENT_UPLOAD_FILE_SIZE_LIMIT
        if file_size > limit_size:
            limit_size = hum_convert(limit_size)
            raise errors.BadRequestError(msg=f"上传文件大小超过了系统限制{limit_size}")
        mime_type = file.content_type
        filename = file.filename
        path = await add_attachment_file(file_contents, extension=extension)
        attachment = AttachmentFile()
        attachment.name = filename
        attachment.size = file_size
        attachment.extension = extension
        attachment.mime_type = mime_type
        attachment.path = path
        attachment.author_id = get_current_user().id
        db.session.add(attachment)
        await db.session.commit()
        return attachment

    async def used_attachment(self, attachment_id: int, auto_commit: bool = False):
        if not attachment_id:
            return
        attachemnt = await self.get_by_id(attachment_id)
        if not attachemnt:
            return
        attachemnt.is_used = True
        db.session.add(attachemnt)
        if auto_commit:
            await db.session.commit()

    async def discard_attachment(self, attachment_id: int, auto_commit: bool = False):
        if not attachment_id:
            return
        attachemnt = await self.get_by_id(attachment_id)
        if not attachemnt:
            return
        attachemnt.is_used = False
        db.session.add(attachemnt)
        if auto_commit:
            await db.session.commit()

    async def clear_un_used_attachment(self):
        logger.debug("clear unused attachment")
        async with db():
            unused_attachments = await self.get_list([AttachmentFile.is_used == False])
            remove_ids = []
            for unused_attachment in unused_attachments:
                delta = datetime.now() - unused_attachment.created_at
                is_expired = delta.days > settings.ATTACHMENT_UPLOAD_FILE_EXPIRED_DAYS
                if is_expired:
                    remove_attachment_file(unused_attachment.path)
                    remove_ids.append(unused_attachment.id)
                    logger.warning(
                        f"remove attachment file {unused_attachment.path}")
            if len(remove_ids) > 0:
                await self.batch_logic_delete(remove_ids)


attachment_file_service = AttachmentFileService()
