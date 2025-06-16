from typing import Annotated, Literal
from better_crud import get_crud_routes
from fastapi import APIRouter, Depends, Path, Query, Request, Body, BackgroundTasks
from pydantic import BaseModel
from app.common.model.field import FieldInfo
from app.common.security.jwt import DependsJwtAuth
from app.common.response.response_schema import ResponseModel, response_base
from app.utils.common import find
router = APIRouter()


def schema_from_model_fields(fields):
    schemas = []
    for key, field_info in fields.items():
        if isinstance(field_info, FieldInfo):
            options = None
            schema = {
                "name": key,
                "label": field_info.label or key,
                "widget": field_info.widget,
                "description": field_info.description
            }
            if field_info.enum:
                options = [{"label": enum_item.name_ if hasattr(enum_item, "name_") else enum_item.name, "value": enum_item.value}
                           for enum_item in field_info.enum]
                schema["options"] = options
            schemas.append(schema)
    return schemas


@router.get('/{module}')
async def get_schema(
    request: Request,
    type_: Literal["list", "create", "edit"] = Query(None, alias="type"),
    module: str = Path(..., title="The ID of the item to get"),
) -> ResponseModel:
    crud_routes = get_crud_routes()
    module_route = find(
        crud_routes, lambda x: x[2].feature == module)
    if not module_route:
        return response_base.success(data=[])
    crud_options = module_route[2]
    schema_model: BaseModel = None
    if type_ == "create":
        schema_model = crud_options.dto.create
    elif type_ == "edit":
        schema_model = crud_options.dto.update
    else:
        schema_model = crud_options.serialize.get_many or crud_options.serialize.base
    return response_base.success(data=schema_from_model_fields(schema_model.model_fields))
