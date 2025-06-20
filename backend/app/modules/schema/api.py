import json
from typing import Annotated, List, Literal, Optional
from better_crud import get_crud_routes
from fastapi import APIRouter, Depends, Path, Query, Request, Body, BackgroundTasks
from pydantic import BaseModel
from pydantic.json_schema import GenerateJsonSchema, JsonSchemaValue
from app.common.model.field import FieldInfo
from app.common.security.jwt import DependsJwtAuth
from app.common.response.response_schema import ResponseModel, response_base
from app.modules.schema.models import FieldOptionModel, FieldSchemaModel
from app.utils.common import find
router = APIRouter()


@router.get('/{module}')
async def get_module_schema(
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
    json_schema = schema_model.model_json_schema()
    return response_base.success(data=json_schema)
