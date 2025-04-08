from app.middleware.request_context import get_request
from .models import CurrentUser


def get_current_user() -> CurrentUser:
    request = get_request()
    return request.user
