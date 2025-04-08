import sys
from app.extensions import logger
from redis.asyncio import Redis
from redis.exceptions import AuthenticationError, TimeoutError
from app.config.settings import settings


class RedisCli(Redis):
    def __init__(self):
        super(RedisCli, self).__init__(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD,
            db=settings.REDIS_DATABASE,
            socket_timeout=settings.REDIS_TIMEOUT,
            decode_responses=True,
        )

    async def open(self):
        """
        Try connection
        :return:
        """
        logger.debug("open")
        try:
            await self.ping()
        except TimeoutError:
            logger.error('❌ Redis connection timed out')
            sys.exit()
        except AuthenticationError:
            logger.error('❌ Redis connection authentication failed')
            sys.exit()
        except Exception as e:
            logger.error('❌ Redis connection unknow exception {}', e)
            sys.exit()

    async def delete_prefix(self, prefix: str, exclude: str | list = None):
        """
        Delete all keys with the specified prefix

        :param prefix:
        :param exclude:
        :return:
        """
        keys = []
        async for key in self.scan_iter(match=f'{prefix}*'):
            if isinstance(exclude, str):
                if key != exclude:
                    keys.append(key)
            elif isinstance(exclude, list):
                if key not in exclude:
                    keys.append(key)
            else:
                keys.append(key)
        if keys:
            await self.delete(*keys)


redis_client: RedisCli = RedisCli()


async def incr_value(key: str, amount: int | None = 1, fmt: str | None = None):
    await redis_client.incr(key, amount=amount)
    value = await redis_client.get(key)
    if fmt:
        return fmt % int(value)
    return int(value)
