from better_crud import BetterCrudGlobalConfig
from app.common.security.jwt import DependsJwtAuth
from app.common.security.rbac import DependsRBAC
from app.common.response.response_schema import ResponseModel
from app.common.depends import get_db_session


def register_crud():
    BetterCrudGlobalConfig.init(
        response_schema=ResponseModel,
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
        routes={"dependencies": [DependsJwtAuth], "exclude": ["update_many"]},
    )
