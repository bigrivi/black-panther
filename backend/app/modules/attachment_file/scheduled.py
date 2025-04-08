
from app.extensions.scheduler import scheduler_service
from .service import attachment_file_service


@scheduler_service.scheduled_job(
    'cron',
    job_id="clear_un_used_attachment",
    day_of_week='*',
    hour="00",
    minute="00",
    second="00"
)
async def clear_un_used_attachment():
    await attachment_file_service.clear_un_used_attachment()
