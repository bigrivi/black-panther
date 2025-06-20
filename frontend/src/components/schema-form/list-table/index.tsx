import { ConfirmButton, Paper } from "@/components";
import { IEnumOption, Schema } from "@/interfaces";
import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useGetLocale, useTranslate } from "@refinedev/core";
import {
    MaterialReactTable,
    MRT_ColumnDef,
    useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_ZH_HANS } from "material-react-table/locales/zh-Hans";
import { FC, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { fieldFactory } from "../field-factory";
interface ListTableProps {
    name: string;
    schema?: Schema;
}
export const ListTable: FC<ListTableProps> = ({ schema, name }) => {
    const t = useTranslate();
    const locale = useGetLocale();
    const currentLocale = locale();
    const { fields, append, remove, move } = useFieldArray({
        name,
        keyName: "key",
    });

    const listFields = useMemo(() => {
        if (schema) {
            const { properties } = schema;
            return Object.keys(properties)
                .filter((key) => !!properties[key].valueType)
                .map((key) => {
                    return {
                        ...properties[key],
                        name: key,
                    };
                });
        }
        return [];
    }, [schema]);

    const columns = useMemo<MRT_ColumnDef<IEnumOption>[]>(
        () => [
            ...listFields.map((field): MRT_ColumnDef<any> => {
                return {
                    accessorKey: field.name,
                    enableHiding: false,
                    size: ["checkbox", "switch"].includes(field.valueType)
                        ? 100
                        : 200,
                    header: field.title,
                    Header: () => (
                        <>
                            {field.title}
                            {schema?.required?.includes(field.name) && (
                                <span
                                    style={{ color: "red" }}
                                    className="MuiFormLabel-asterisk MuiInputLabel-asterisk"
                                >
                                    *
                                </span>
                            )}
                        </>
                    ),
                    enableColumnActions: false,
                    muiTableBodyCellProps: { valign: "top" },
                    Cell: function render({ row, staticRowIndex }) {
                        return fieldFactory({
                            ...field,
                            required: schema?.required?.includes(field.name),
                            name: `${name}.${staticRowIndex}.${field.name}`,
                        });
                    },
                };
            }),

            {
                accessorKey: "actions",
                header: "",
                enableHiding: false,
                enableColumnActions: false,
                size: 60,
                Header: ({ column }) => (
                    <IconButton
                        size="small"
                        onClick={() =>
                            append({
                                name: "",
                                code: "",
                            })
                        }
                    >
                        <Add fontSize="small" />
                    </IconButton>
                ),
                enableColumnFilter: false,
                enableSorting: false,
                Cell: function render({ row, staticRowIndex }) {
                    return (
                        <ConfirmButton
                            title="Delete Option"
                            message={
                                "Are you sure you want to delete the option?"
                            }
                            onConfirm={() => remove(staticRowIndex)}
                        >
                            <IconButton size="small">
                                <Delete />
                            </IconButton>
                        </ConfirmButton>
                    );
                },
            },
        ],
        [schema]
    );

    const table = useMaterialReactTable({
        columns,
        data: fields,
        enablePagination: false,
        enableRowOrdering: false,
        localization:
            currentLocale == "zh"
                ? MRT_Localization_ZH_HANS
                : MRT_Localization_EN,
        enableFilters: false,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableSorting: false,
        getRowId: (originalRow) => {
            return originalRow.key!;
        },
        muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow) {
                    move(draggingRow.index, hoveredRow.index!);
                }
            },
        }),
        enableColumnPinning: true,
        initialState: {
            columnPinning: { right: ["actions"] },
        },
        muiTableBodyCellProps: {
            sx: {
                padding: 1,
            },
        },
    });

    return (
        <Paper>
            <MaterialReactTable table={table} />
        </Paper>
    );
};
