from uuid import uuid4
import hashlib
import random
import time
from typing import List, TypeVar, Callable, Optional
import json
import re
import datetime
from decimal import Decimal, ROUND_HALF_UP
from app.extensions.redis import redis_client, incr_value

FindType = TypeVar('FindType')


uuidChars = ("a", "b", "c", "d", "e", "f",
             "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
             "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
             "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
             "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
             "W", "X", "Y", "Z")


def gen_uuid():
    return uuid4()


def get_timestamp():
    '''
    获取13位unix timestamp，到毫秒
    '''
    return int(round(time.time() * 1000))


def gen_id():
    rnd = random.randint(100000, 999999)
    return str(get_timestamp())+str(rnd)


def gen_id_by_rnd(rnd):
    return str(get_timestamp())+str(rnd)


def gen_rnd_list(count):
    '''
    生成6位数的随机数列表
    '''
    return random.sample(range(100000, 999999), count)


def gen_app_secret():
    data = uuid4().hex
    md5 = hashlib.md5()
    md5.update(data.encode(encoding='UTF-8'))
    return md5.hexdigest()


def short_uuid():
    uuid = str(uuid4()).replace('-', '')
    result = ''
    for i in range(0, 8):
        sub = uuid[i * 4: i * 4 + 4]
        x = int(sub, 16)
        result += uuidChars[x % 0x3E]
    return result


def find(data: List[FindType], fun: Callable[[FindType], bool]) -> FindType:
    for item in data:
        if fun(item):
            return item


def hum_convert(value):
    units = ["B", "KB", "MB", "GB", "TB", "PB"]
    size = 1024.0
    for i in range(len(units)):
        if (value / size) < 1:
            return "%.2f%s" % (value, units[i])
        value = value / size


def drop_duplicates(data_list: List, check_fn) -> List:
    unique_list = []
    for item in data_list:
        exist = find(unique_list, lambda x: check_fn(x, item))
        if exist:
            continue
        unique_list.append(item)
    return unique_list

# def gen_oa_id(count:int = 1)->List[str]:
#     timestamp = str_now("%Y%m%d%H%M%S")
#     rnd_list = random.sample(range(10000, 99999), count)
#     gen_id_list = []
#     for i in range(count):
#         gen_id_list.append(timestamp+str(rnd_list[i]))
#     return gen_id_list


class CommonJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(obj, Decimal):
            return float(obj)
        else:
            return json.JSONEncoder.default(self, obj)


async def semaphore_wrapper(fun, semaphore, *args, **kargs):
    async with semaphore:
        return await fun(*args, **kargs)


async def generate_application_number(prefix, company_code):
    # sn = "%03d" % int(count)
    # timestamp = str_now("%Y%m%d")
    # return f"{prefix}-{company_code}-{timestamp}-{sn}"
    return f"{prefix}-{company_code}-"


def round2(number, ndigits: int = 0):
    if number is None:
        return 0
    decimal = "0"
    if ndigits > 0:
        decimal = "0."+'0' * ndigits
    n = float(Decimal(str(number)).quantize(Decimal(decimal), ROUND_HALF_UP))
    if ndigits == 0:
        return round(n)
    return n


async def generate_seq_numbers(cache_prefix: str, prefix: str, count: int, fmt: str = "%08d") -> List[str]:
    async with redis_client.lock("generate_seq_numbers"):
        bill_nos = []
        for _ in range(count):
            incr_no = await incr_value(f"{cache_prefix}", fmt=fmt)
            bill_nos.append(prefix+incr_no)
        return bill_nos


def format_sum_formula(formula):
    if "=SUM" not in formula:
        return formula
    RE_VAR_PATTERN = r'(\w*!*[A-Za-z]{1,3}\d+):(\w*!*[A-Za-z]{1,3}\d+)'

    def replace_fn(matched):
        addr_str = matched.group(0)
        first, second = addr_str.split(":")
        return first+":"+second.split("!")[1]
    new_formula = re.sub(RE_VAR_PATTERN, replace_fn, formula)
    return new_formula
