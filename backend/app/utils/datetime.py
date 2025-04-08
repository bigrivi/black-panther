from datetime import datetime
import calendar


def str_now(format="%Y-%m-%d %H:%M:%S"):
    return datetime.now().strftime(format)


def now():
    return datetime.now().replace(microsecond=0)


def strptime(str_time):
    """convert  datetime string to datetime

    Args:
        str_time (_type_): _description_

    Returns:
        _type_: _description_
    """
    try:
        return datetime.strptime(str_time, '%Y-%m-%d %H:%M:%S')
    except:
        try:
            return datetime.strptime(str_time, '%Y-%m-%d %H:%M:%S.%f')
        except:
            return None


def strftime(time, format="%Y-%m-%d %H:%M:%S"):
    return datetime.strftime(time, format)


def format_time(time: str):
    parts = time.split(":")
    hour = parts[0]
    minutes = parts[1]
    if len(hour) == 1:
        hour = "0"+hour
    if len(minutes) == 1:
        minutes = "0"+minutes
    return hour+":"+minutes


def last_day_of_month(date: datetime = None):
    date = date or datetime.now()
    date = date.replace(day=calendar.monthrange(date.year, date.month)[1])
    return date.replace(hour=23, minute=59, second=59)
