from enum import Enum
from better_crud import BetterCrudGlobalConfig
from better_crud.enums import RoutesEnum
from app.common.security.jwt import DependsJwtAuth
from app.common.security.rbac import DependsRBAC
from app.common.response.response_schema import ResponseModel
from app.common.depends import get_db_session


ACTION_MAP = {
    RoutesEnum.get_many: "list",
    RoutesEnum.get_one: "show",
    RoutesEnum.create_one: "create",
    RoutesEnum.create_many: "create",
    RoutesEnum.update_one: "edit",
    RoutesEnum.update_many: "edit",
    RoutesEnum.delete_many: "delete"
}


def register_crud():
    BetterCrudGlobalConfig.init(
        response_schema=ResponseModel,
        action_map=ACTION_MAP,
        backend_config={
            "sqlalchemy": {
                "db_session": get_db_session
            }
        },
        query={
            "soft_delete": True,
            "sort": [
                {
                    "field": "updated_at",
                    "sort": "DESC"
                }
            ],
        },
        soft_deleted_field_key="expiry_at",
        routes={"dependencies": [DependsJwtAuth,
                                 DependsRBAC], "exclude": ["update_many"]},
    )
