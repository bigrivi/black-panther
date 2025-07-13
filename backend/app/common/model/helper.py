from copy import deepcopy
from typing import Any, Optional, Tuple, Type, TypeVar
from pydantic import BaseModel, create_model
from pydantic.fields import FieldInfo

BaseModelT = TypeVar('BaseModelT', bound=BaseModel)


def make_optional_field(field: FieldInfo, default: Any = None) -> Tuple[Any, FieldInfo]:
    new = deepcopy(field)
    new.default = default
    new.annotation = Optional[field.annotation]
    return new.annotation, new


def partial_model(model: Type[BaseModelT]) -> Type[BaseModelT]:
    return create_model(
        f'Partial{model.__name__}',
        __base__=model,
        __module__=model.__module__,
        **{
            field_name: make_optional_field(field_info)
            for field_name, field_info in model.model_fields.items()
        }
    )
