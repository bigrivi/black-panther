

from fastapi import Request
import dataclasses
from user_agents import parse


@dataclasses.dataclass
class UserAgentInfo:
    user_agent: str
    os: str | None
    browser: str | None
    device: str | None


def get_request_ip(request: Request) -> str:
    real = request.headers.get('X-Real-IP')
    if real:
        ip = real
    else:
        forwarded = request.headers.get('X-Forwarded-For')
        if forwarded:
            ip = forwarded.split(',')[0]
        else:
            ip = request.client.host
    return ip


def get_user_agent_info(request: Request) -> UserAgentInfo:
    user_agent = request.headers.get('User-Agent')
    _user_agent = parse(user_agent)
    os = _user_agent.get_os()
    browser = _user_agent.get_browser()
    device = _user_agent.get_device()
    return UserAgentInfo(user_agent=user_agent, device=device, os=os, browser=browser)
