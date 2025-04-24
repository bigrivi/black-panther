from datetime import datetime, timedelta
from typing import Optional
from app.config.settings import settings
import json
from jose import ExpiredSignatureError, JWTError, jwt
import time
from sqlalchemy.orm import joinedload
from fastapi.security.utils import get_authorization_scheme_param
from fastapi import Depends, Request
from fastapi.security import HTTPBearer
from passlib.context import CryptContext
from app.exception.errors import TokenError, AuthorizationError
from app.extensions.redis import redis_client
from app.modules.user.models import CurrentUser

pwd_context = CryptContext(schemes=['bcrypt'])


def get_credentials(credentials: Optional[str] = Depends(HTTPBearer(auto_error=False))):
    if not credentials:
        raise AuthorizationError(msg="Not authenticated")


DependsJwtAuth = Depends(get_credentials)


def get_token(request: Request) -> str:
    """
    Get token from request header

    :return:
    """
    authorization = request.headers.get('Authorization')
    scheme, token = get_authorization_scheme_param(authorization)
    if not authorization or scheme.lower() != 'bearer':
        raise TokenError(msg='Invalid token')
    return token


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_hashed_password(password):
    return pwd_context.hash(password)


async def create_access_token(sub: str):
    expiry_at = int(time.time()) + settings.TOKEN_EXPIRE_SECONDS
    expiry_date = datetime.fromtimestamp(expiry_at).replace(
        minute=0, hour=0, second=0, microsecond=0)
    expiry_at = int(datetime.timestamp(expiry_date))
    to_encode = ({"exp": expiry_at, "sub": sub})
    encoded_jwt = jwt.encode(
        to_encode, settings.TOKEN_SECRET_KEY, algorithm=settings.TOKEN_ALGORITHM)
    key = f'{settings.TOKEN_REDIS_PREFIX}:{sub}:{encoded_jwt}'
    await redis_client.setex(key, settings.TOKEN_EXPIRE_SECONDS, encoded_jwt)
    return encoded_jwt, expiry_at


async def create_refresh_token(sub: str):
    expiry_at = int(time.time()) + settings.TOKEN_REFRESH_EXPIRE_SECONDS
    to_encode = ({"exp": expiry_at, "sub": sub})
    encoded_jwt = jwt.encode(
        to_encode, settings.TOKEN_SECRET_KEY, algorithm=settings.TOKEN_ALGORITHM)
    key = f'{settings.TOKEN_REFRESH_REDIS_PREFIX}:{sub}:{encoded_jwt}'
    await redis_client.setex(key, settings.TOKEN_REFRESH_EXPIRE_SECONDS, encoded_jwt)
    return encoded_jwt, expiry_at


async def create_new_token(sub: str, token: str, refresh_token: str):
    """
    Generate new token

    :param sub:
    :param token
    :param refresh_token:
    :param multi_login:
    :return:
    """
    redis_refresh_token = await redis_client.get(f'{settings.TOKEN_REFRESH_REDIS_PREFIX}:{sub}:{refresh_token}')
    if not redis_refresh_token or redis_refresh_token != refresh_token:
        raise TokenError(msg='Refresh Token 已过期')

    access_token, access_token_expire_time = await create_access_token(sub)
    refresh_token, refresh_token_expire_time = await create_refresh_token(sub)

    token_key = f'{settings.TOKEN_REDIS_PREFIX}:{sub}:{token}'
    refresh_token_key = f'{settings.TOKEN_REFRESH_REDIS_PREFIX}:{sub}:{refresh_token}'
    await redis_client.delete(token_key)
    await redis_client.delete(refresh_token_key)
    return access_token, access_token_expire_time, refresh_token, refresh_token_expire_time


def jwt_decode(token: str) -> str:
    """
    Decode token

    :param token:
    :return:
    """
    try:
        payload = jwt.decode(token, settings.TOKEN_SECRET_KEY, algorithms=[
                             settings.TOKEN_ALGORITHM])
        user_id = int(payload.get('sub'))
        if not user_id:
            raise TokenError(msg='Invalid token')
    except ExpiredSignatureError:
        raise TokenError(msg='Token expired')
    except (JWTError, Exception):
        raise TokenError(msg='Invalid token')
    return user_id


async def jwt_authentication(token: str) -> CurrentUser:
    """
    JWT authentication

    :param token:
    :return:
    """
    user_id = jwt_decode(token)
    key = f'{settings.TOKEN_REDIS_PREFIX}:{user_id}:{token}'
    token_verify = await redis_client.get(key)
    if not token_verify:
        raise TokenError(msg='Token expired')
    cache_user = await redis_client.get(f'{settings.JWT_USER_REDIS_PREFIX}:{user_id}')
    cache_user = None
    if not cache_user:
        from app.modules.user.service import user_service
        user = await user_service.get_current_user_data(user_id)
        await redis_client.setex(
            f'{settings.JWT_USER_REDIS_PREFIX}:{user_id}',
            settings.JWT_USER_REDIS_EXPIRE_SECONDS,
            user.model_dump_json(),
        )
    else:
        user = CurrentUser.model_validate(json.loads(cache_user))
    return user
