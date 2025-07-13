from enum import Enum
from typing import AbstractSet, Any, Callable, Dict, List, Literal, Mapping, Optional, Sequence, Type, Union

from sqlalchemy import Column
from sqlmodel._compat import Undefined, UndefinedType, post_init_field_info
from sqlmodel.main import FieldInfo as SQLFieldInfo, NoArgAnyCallable
from app.enums import IntEnumType

OnDeleteType = Literal["CASCADE", "SET NULL", "RESTRICT"]

ValueType = Literal[
    'text',
    'textarea',
    'switch',
    "select",
    "treeSelect",
    "multiSelect",
    "password",
    "checkbox",
    "listTable",
    "autocomplete",
    "checkboxGroup",
    "autocomplete"
]


class FieldInfo(SQLFieldInfo):
    def __init__(
        self,
        default: Any = Undefined,
        *,
        default_factory: Optional[NoArgAnyCallable] = None,
        alias: Optional[str] = None,
        title: Optional[str] = None,
        description: Optional[str] = None,
        exclude: Union[
            AbstractSet[Union[int, str]], Mapping[Union[int, str], Any], Any
        ] = None,
        include: Union[
            AbstractSet[Union[int, str]], Mapping[Union[int, str], Any], Any
        ] = None,
        const: Optional[bool] = None,
        gt: Optional[float] = None,
        ge: Optional[float] = None,
        lt: Optional[float] = None,
        le: Optional[float] = None,
        multiple_of: Optional[float] = None,
        max_digits: Optional[int] = None,
        decimal_places: Optional[int] = None,
        min_items: Optional[int] = None,
        max_items: Optional[int] = None,
        unique_items: Optional[bool] = None,
        min_length: Optional[int] = None,
        max_length: Optional[int] = None,
        allow_mutation: bool = True,
        regex: Optional[str] = None,
        discriminator: Optional[str] = None,
        repr: bool = True,
        primary_key: Union[bool, UndefinedType] = Undefined,
        foreign_key: Any = Undefined,
        ondelete: Union[OnDeleteType, UndefinedType] = Undefined,
        unique: Union[bool, UndefinedType] = Undefined,
        nullable: Union[bool, UndefinedType] = Undefined,
        index: Union[bool, UndefinedType] = Undefined,
        sa_type: Union[Type[Any], UndefinedType] = Undefined,
        sa_column: Union[Column, UndefinedType] = Undefined,  # type: ignore
        sa_column_args: Union[Sequence[Any], UndefinedType] = Undefined,
        sa_column_kwargs: Union[Mapping[str, Any], UndefinedType] = Undefined,
        schema_extra: Optional[Dict[str, Any]] = None,
        order: Optional[int] = None,
        enum: Optional[Enum] = None,
        value_type: Optional[ValueType] = None,
        reference: Optional[str] = None,
        hide_in_list: Optional[bool] = False
    ) -> Any:
        current_schema_extra = schema_extra or {}
        json_schema_extra = current_schema_extra.get("json_schema_extra") or {}
        if value_type:
            json_schema_extra.update({
                "valueType": value_type

            })
        if enum:
            json_schema_extra.update({
                "options": [dict(label=enum_item.name_ if hasattr(enum_item, "name_") else enum_item.name, value=enum_item.value) for enum_item in enum]
            })
        if reference:
            json_schema_extra.update({
                "reference": reference
            })

        if hide_in_list is not None:
            json_schema_extra.update({
                "hideInList": hide_in_list
            })

        self.order = order
        self.enum = enum
        self.value_type = value_type

        super().__init__(
            default,
            default_factory=default_factory,
            alias=alias,
            title=title,
            description=description,
            exclude=exclude,
            include=include,
            const=const,
            gt=gt,
            ge=ge,
            lt=lt,
            le=le,
            multiple_of=multiple_of,
            max_digits=max_digits,
            decimal_places=decimal_places,
            min_items=min_items,
            max_items=max_items,
            unique_items=unique_items,
            min_length=min_length,
            max_length=max_length,
            allow_mutation=allow_mutation,
            regex=regex,
            discriminator=discriminator,
            repr=repr,
            primary_key=primary_key,
            foreign_key=foreign_key,
            ondelete=ondelete,
            unique=unique,
            nullable=nullable,
            index=index,
            sa_type=sa_type,
            sa_column=sa_column,
            sa_column_args=sa_column_args,
            sa_column_kwargs=sa_column_kwargs,
            **current_schema_extra,
            json_schema_extra=json_schema_extra,
        )


def Field(
    *,
    default: Any = Undefined,
    default_factory: Optional[NoArgAnyCallable] = None,
    alias: Optional[str] = None,
    title: Optional[str] = None,
    description: Optional[str] = None,
    exclude: Union[
        AbstractSet[Union[int, str]], Mapping[Union[int, str], Any], Any
    ] = None,
    include: Union[
        AbstractSet[Union[int, str]], Mapping[Union[int, str], Any], Any
    ] = None,
    const: Optional[bool] = None,
    gt: Optional[float] = None,
    ge: Optional[float] = None,
    lt: Optional[float] = None,
    le: Optional[float] = None,
    multiple_of: Optional[float] = None,
    max_digits: Optional[int] = None,
    decimal_places: Optional[int] = None,
    min_items: Optional[int] = None,
    max_items: Optional[int] = None,
    unique_items: Optional[bool] = None,
    min_length: Optional[int] = None,
    max_length: Optional[int] = None,
    allow_mutation: bool = True,
    regex: Optional[str] = None,
    discriminator: Optional[str] = None,
    repr: bool = True,
    primary_key: Union[bool, UndefinedType] = Undefined,
    foreign_key: Any = Undefined,
    ondelete: Union[OnDeleteType, UndefinedType] = Undefined,
    unique: Union[bool, UndefinedType] = Undefined,
    nullable: Union[bool, UndefinedType] = Undefined,
    index: Union[bool, UndefinedType] = Undefined,
    sa_type: Union[Type[Any], UndefinedType] = Undefined,
    sa_column: Union[Column, UndefinedType] = Undefined,  # type: ignore
    sa_column_args: Union[Sequence[Any], UndefinedType] = Undefined,
    sa_column_kwargs: Union[Mapping[str, Any], UndefinedType] = Undefined,
    schema_extra: Optional[Dict[str, Any]] = None,
    order: Optional[int] = None,
    enum: Optional[Enum] = None,
    value_type: Optional[ValueType] = None,
    reference: Optional[str] = None,
    hide_in_list: Optional[bool] = False
) -> Any:
    current_schema_extra = schema_extra or {}
    if enum and sa_type is Undefined:
        sa_type = IntEnumType(enum_class=enum)  # type: ignore
    field_info = FieldInfo(
        default,
        default_factory=default_factory,
        alias=alias,
        title=title,
        description=description,
        exclude=exclude,
        include=include,
        const=const,
        gt=gt,
        ge=ge,
        lt=lt,
        le=le,
        multiple_of=multiple_of,
        max_digits=max_digits,
        decimal_places=decimal_places,
        min_items=min_items,
        max_items=max_items,
        unique_items=unique_items,
        min_length=min_length,
        max_length=max_length,
        allow_mutation=allow_mutation,
        regex=regex,
        discriminator=discriminator,
        repr=repr,
        primary_key=primary_key,
        foreign_key=foreign_key,
        ondelete=ondelete,
        unique=unique,
        nullable=nullable,
        index=index,
        sa_type=sa_type,
        sa_column=sa_column,
        sa_column_args=sa_column_args,
        sa_column_kwargs=sa_column_kwargs,
        order=order,
        enum=enum,
        value_type=value_type,
        reference=reference,
        hide_in_list=hide_in_list,
        **current_schema_extra,
    )
    post_init_field_info(field_info)
    return field_info
