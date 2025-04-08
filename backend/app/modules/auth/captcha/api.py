from fastapi import APIRouter, Depends, Request
from fast_captcha import img_captcha
from starlette.concurrency import run_in_threadpool
from app.utils.common import gen_uuid
from app.extensions import redis_client
from app.config.settings import settings
from app.common.response import ResponseModel, response_base
from .models import CaptchaResponseModel

router = APIRouter()


@router.get(
    '',
)
async def get_captcha(request: Request) -> ResponseModel[CaptchaResponseModel]:
    img_type: str = 'base64'
    uuid = str(gen_uuid())
    img, code = await run_in_threadpool(img_captcha, font_type="static/fonts/B612Mono-Regular-Tweaked.ttf", img_byte=img_type)
    print(code)
    await redis_client.set(
        f'{settings.CAPTCHA_LOGIN_REDIS_PREFIX}:{uuid}', code, ex=settings.CAPTCHA_LOGIN_EXPIRE_SECONDS
    )
    return response_base.success(data=CaptchaResponseModel(image_type=img_type, image=img, uuid=uuid))
