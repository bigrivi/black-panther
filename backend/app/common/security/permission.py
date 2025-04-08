from fastapi import Request
class RequestPermission:

    def __init__(self, value: str):
        self.value = value

    async def __call__(self, request: Request):
        request.state.permission = self.value
