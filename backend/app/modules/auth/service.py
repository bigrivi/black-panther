from datetime import datetime, timedelta
from fastapi import Request, BackgroundTasks
from starlette.background import BackgroundTask, BackgroundTasks
from .models import UserLoginRequestModel, AuthLoginSuccessModel, TokenModel
from app.modules.user.service import UserService, user_service, User
from app.config.settings import settings
from app.utils.datetime import strftime
from app.extensions import redis_client, logger
from app.middleware.fastapi_sqlalchemy import db
from app.common.security.jwt import create_new_token, jwt_decode, verify_password, create_access_token, create_refresh_token, get_token
from app.exception.errors import AuthorizationError, TokenError, NotFoundError, AccountLockError, BadRequestError
from app.modules.user.service import user_service
from app.modules.login_log.service import LoginLogService


class AuthService():

    @staticmethod
    async def login(request: Request, login_model: UserLoginRequestModel, background_tasks: BackgroundTasks,):
        login_name = login_model.login_name
        password = login_model.password
        captcha = login_model.captcha
        uuid = login_model.uuid
        verify_key = f'{settings.CAPTCHA_LOGIN_REDIS_PREFIX}:{uuid}'
        captcha_code = await redis_client.get(verify_key)
        user = None
        try:
            if not captcha_code:
                raise BadRequestError(msg='验证码失效，请重新获取')
            if captcha_code.lower() != captcha.lower():
                raise BadRequestError(msg='验证码错误')
            user = await user_service.get_one(User.login_name == login_name)
            if not user:
                raise NotFoundError(msg="用户名或密码有误")
            if not user.is_active:
                raise BadRequestError(msg='用户未激活, 请联系统管理员')
            num_error_login = int(
                user.num_error_login) if user.num_error_login is not None else 0
            lock_time_value = settings.LOGIN_LOCK_TIME_VALUE
            lock_time_unit = settings.LOGIN_LOCK_TIME_UNIT
            tmp_lock_str = str(lock_time_value)
            if lock_time_unit == "min":
                tmp_lock_str = tmp_lock_str+"分钟"
            elif lock_time_unit == "hour":
                tmp_lock_str = tmp_lock_str+"小时"

            if num_error_login > 0 and num_error_login % settings.MAX_ERROR_LOGIN_NUM == 0:  # 刚好到了锁定次数
                last_error_login_time = datetime.strptime(
                    str(user.last_error_login), "%Y-%m-%d %H:%M:%S")
                if lock_time_unit == "min":
                    past_value = (datetime.now() -
                                  last_error_login_time).seconds / 60
                elif lock_time_unit == "hour":
                    past_value = (datetime.now() -
                                  last_error_login_time).seconds / 3600
                if past_value <= lock_time_value:
                    rest_time_value = lock_time_value-past_value
                    logger.warning(
                        f"{login_name} lock rest {rest_time_value} ")
                    next_valid_login_date = user.last_error_login + \
                        timedelta(minutes=settings.LOGIN_LOCK_TIME_VALUE)
                    raise AccountLockError(
                        strftime(next_valid_login_date), msg=f"账户已经被锁定，请稍后再试")
            if not verify_password(password, user.password):  # 密码错误
                user.num_error_login = num_error_login + 1
                if user.num_error_login % settings.MAX_ERROR_LOGIN_NUM == 0:
                    user.last_error_login = datetime.now()
                    db.session.add(user)
                    await db.session.commit()
                    next_valid_login_date = user.last_error_login + \
                        timedelta(minutes=settings.LOGIN_LOCK_TIME_VALUE)
                    raise AccountLockError(strftime(
                        next_valid_login_date), msg=f"连续错误输入{settings.MAX_ERROR_LOGIN_NUM}次,该账户将被锁定{tmp_lock_str}")
                else:
                    db.session.add(user)
                    await db.session.commit()
                    if user.num_error_login >= 2:
                        raise BadRequestError(
                            msg=f"已经连续{user.num_error_login}次输入错误，如果连续错误5次将被锁定30分钟")
                    else:
                        raise BadRequestError(msg="用户密码错误")
            if user.valid_state == 0:
                raise BadRequestError(msg="账户未激活")
            is_first_login = user.last_login_date is None
        except NotFoundError as e:
            raise NotFoundError(msg=e.msg)
        except (BadRequestError, AccountLockError) as e:
            task = None
            if user:
                task = BackgroundTask(
                    LoginLogService.create,
                    **dict(
                        request=request,
                        user_id=user.id,
                        user_name=user.user_name,
                        status=0,
                        msg=e.msg,
                    ),
                )
            raise BadRequestError(msg=e.msg, data=e.data, background=task)
        except Exception as e:
            raise e
        # login success
        user.num_error_login = 0
        user.last_ip = request.client.host
        user.last_login_date = datetime.now()
        db.session.add(user)
        await UserService.clear_jwt_cache_user(user_id=user.id)
        await db.session.commit()
        access_token, access_token_expire_time = await create_access_token(sub=str(user.id))
        refresh_token, refresh_token_expire_time = await create_refresh_token(sub=str(user.id))
        # success
        background_tasks.add_task(
            LoginLogService.create,
            **dict(
                request=request,
                user_id=user.id,
                user_name=user.user_name,
                status=1,
                msg='登录成功',
            ),
        )
        return AuthLoginSuccessModel(
            access_token=access_token,
            access_token_expire_time=access_token_expire_time,
            is_first_login=is_first_login,
            refresh_token=refresh_token,
            refresh_token_expire_time=refresh_token_expire_time
        )

    @staticmethod
    async def logout(*, request: Request) -> None:
        token = get_token(request)
        key = f'{settings.TOKEN_REDIS_PREFIX}:{request.user.id}:{token}'
        await redis_client.delete(key)

    @staticmethod
    async def new_token(refresh_token, request: Request) -> TokenModel:
        try:
            user_id = jwt_decode(refresh_token)
        except Exception:
            raise TokenError(msg='Refresh Token 无效')
        if request.user.id != user_id:
            raise TokenError(msg='Refresh Token 无效')
        current_user = await user_service.get_by_id(user_id)
        if not current_user:
            raise NotFoundError(msg='用户名或密码有误')
        elif not current_user.valid_state:
            raise AuthorizationError(msg='用户已被锁定, 请联系统管理员')
        current_token = get_token(request)
        access_token, access_token_expire_time, refresh_token, refresh_token_expire_time = await create_new_token(
            sub=str(current_user.id),
            token=current_token,
            refresh_token=refresh_token
        )
        return TokenModel(
            access_token=access_token,
            access_token_expire_time=access_token_expire_time,
            refresh_token=refresh_token,
            refresh_token_expire_time=refresh_token_expire_time
        )
