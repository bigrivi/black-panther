import { ConfirmButton, Paper } from "@/components";
import { IEnumOption, Schema } from "@/interfaces";
import { Add, Delete, Help } from "@mui/icons-material";
import { FormHelperText, IconButton, Tooltip } from "@mui/material";
import { useGetLocale, useTranslate } from "@refinedev/core";
import {
    MaterialReactTable,
    MRT_ColumnDef,
    useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_ZH_HANS } from "material-react-table/locales/zh-Hans";
import { FC, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { fieldFactory } from "../field-factory";
interface ListTableProps {
    required?: boolean;
    name: string;
    description?: string;
    schema?: Schema;
}
export const ListTable: FC<ListTableProps> = ({
    schema,
    name,
    required,
    description,
}) => {
    const locale = useGetLocale();
    const t = useTranslate();
    const currentLocale = locale();
    const {
        formState: { errors },
    } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
        name,
        keyName: "key",
        rules: {
            ...(required && { required: t("errors.required") }),
        },
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
                            {field.description && (
                                <Tooltip
                                    placement="top"
                                    slotProps={{
                                        popper: {
                                            modifiers: [
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, -14],
                                                    },
                                                },
                                            ],
                                        },
                                    }}
                                    arrow
                                    title={description}
                                >
                                    <IconButton size="small">
                                        <Help fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </>
                    ),
                    enableColumnActions: false,
                    muiTableBodyCellProps: { sx: { verticalAlign: "top" } },
                    Cell: function render({ row, staticRowIndex }) {
                        return fieldFactory({
                            ...field,
                            required: schema?.required?.includes(field.name),
                            name: `${name}.${staticRowIndex}.${field.name}`,
                            renderHelp: false,
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
    const error = !!errors[name];
    const renderHelperText: string | undefined =
        (errors[name]?.root?.message as string) ?? description;

    return (
        <>
            <Paper style={{ borderColor: error ? "red" : undefined }}>
                <MaterialReactTable table={table} />
            </Paper>
            {renderHelperText && (
                <FormHelperText error={error}>
                    {renderHelperText}
                </FormHelperText>
            )}
        </>
    );
};
