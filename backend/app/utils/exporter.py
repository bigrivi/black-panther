from enum import Enum
import pandas as pd
import io
from typing import Generic, List, Literal, Optional, TypeVar
from urllib.parse import quote
from fastapi.responses import StreamingResponse
from app.utils.datetime import str_now
from app.common.model.field import ExportFieldInfo
T = TypeVar('T')

EXCEL_EXTENSION = ".xlsx"
CSV_EXTENSION = ".csv"
EXPORT_TYPE = Literal["excel", 'csv']


def export_file(
    data_list: list,
    file_name,
    export_type: Optional[EXPORT_TYPE] = "excel",
    data_frame=None,
    keepIndex=False,
    rename_columns=None,
    exclude_columns=None,
    columns=None
):
    if data_frame is not None:
        df = data_frame
    else:
        df = pd.DataFrame.from_records(data_list)
        if columns:
            df = df[columns]
        if rename_columns is not None:
            df.rename(columns=rename_columns, inplace=True)
        if exclude_columns is not None:
            df = df.loc[:, ~df.columns.isin(exclude_columns)]

    file_name = file_name+"_export_"+str_now()
    if export_type == "excel":
        file_name = file_name+EXCEL_EXTENSION
    else:
        file_name = file_name+CSV_EXTENSION
    headers = {
        'Content-Disposition': "attachment; filename*=utf-8''{}".format(quote(file_name))
    }
    out = io.BytesIO()
    if export_type == "excel":
        writer = pd.ExcelWriter(out, engine='xlsxwriter')
        df.to_excel(excel_writer=writer, sheet_name='Sheet1', index=keepIndex)
        writer.close()
    elif export_type == "csv":
        df.to_csv(path_or_buf=out, index=keepIndex)
    out.seek(0)
    return StreamingResponse(out, headers=headers)


class Exporter(Generic[T]):
    def __init__(self, model_cls: T):
        self.model_cls = model_cls

    def to_file(
        self,
        list: List[T],
        file_name: str,
        export_type: Optional[EXPORT_TYPE] = "excel"
    ):
        fields = self.model_cls.model_fields
        order_fields = []
        for key, field_info in fields.items():
            if isinstance(field_info, ExportFieldInfo):
                label = field_info.label
                order = field_info.order or float("inf")
                order_fields.append({"label": label, "order": order})
        order_fields = sorted(order_fields, key=lambda x: x["order"])
        order_fields = [field["label"] for field in order_fields]
        export_data = []
        for budget_compile_config in list:
            row_model = self.model_cls.model_validate(
                budget_compile_config)
            row_data = {}
            for key, field_info in fields.items():
                if isinstance(field_info, ExportFieldInfo):
                    label = field_info.label
                    field_value = getattr(row_model, key)
                    value_enum = field_info.value_enum
                    if isinstance(field_value, Enum):
                        field_value = field_value.value
                    if value_enum and value_enum.get(field_value) is not None:
                        field_value = value_enum.get(field_value)
                    row_data[label] = field_value
            export_data.append(row_data)
        df = pd.DataFrame.from_records(export_data)
        df = df[order_fields]
        print(df.head())
        return export_file([], file_name, data_frame=df, export_type=export_type)
