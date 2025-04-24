from typing import List
from app.exception.errors import BadRequestError
from app.middleware.fastapi_sqlalchemy import db
from app.common.service.base import ServiceBase
from app.utils.common import find
from .models import Resource, ResourceUpdate, ResourceCreate


class ResourceService(ServiceBase[Resource]):
    def __init__(self):
        super().__init__(Resource)

    async def on_before_create(self,  model: ResourceCreate, **kwarg) -> None:
        actions = []
        for action in model.actions:
            actions.append({
                "name": action
            })
        return {
            "actions": actions
        }

    async def on_before_update(self, entity: Resource, model: ResourceUpdate, **kwarg) -> None:
        actions = []
        for action in model.actions:
            exist = find(entity.actions, lambda x: x.name == action)
            if exist:
                actions.append({
                    "id": exist.id
                })
            else:
                actions.append({
                    "name": action
                })
        return {
            "actions": actions
        }


resource_service = ResourceService()
