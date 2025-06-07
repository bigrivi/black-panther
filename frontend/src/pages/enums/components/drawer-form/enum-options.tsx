import { ConfirmButton, Paper } from "@/components";
import { IEnumOption } from "@/interfaces";
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
import { useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { SwitchElement, TextFieldElement } from "react-hook-form-mui";
export const EnumOptionsField = () => {
    const t = useTranslate();
    const locale = useGetLocale();
    const currentLocale = locale();
    const { fields, append, remove, move } = useFieldArray({
        name: "items",
        keyName: "key",
    });
    const columns = useMemo<MRT_ColumnDef<IEnumOption>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("enums.fields.enumOptions.fields.name"),
                enableHiding: false,
                enableColumnActions: false,
                Cell: function render({ row, staticRowIndex }) {
                    return (
                        <TextFieldElement
                            fullWidth
                            required
                            name={`items.${staticRowIndex}.name`}
                        />
                    );
                },
            },
            {
                accessorKey: "value",
                enableHiding: false,
                header: t("enums.fields.enumOptions.fields.value"),
                enableColumnActions: false,
                Cell: function render({ row, staticRowIndex }) {
                    return (
                        <TextFieldElement
                            fullWidth
                            required
                            name={`items.${staticRowIndex}.value`}
                        />
                    );
                },
            },
            {
                accessorKey: "description",
                enableHiding: false,
                header: t("enums.fields.enumOptions.fields.description"),
                enableColumnActions: false,
                Cell: function render({ row, staticRowIndex }) {
                    return (
                        <TextFieldElement
                            fullWidth
                            name={`items.${staticRowIndex}.description`}
                        />
                    );
                },
            },
            {
                accessorKey: "valid_state",
                enableHiding: false,
                header: t("fields.status.label"),
                enableColumnActions: false,
                Cell: function render({ row, staticRowIndex }) {
                    return (
                        <SwitchElement
                            label={t("fields.status.true")}
                            name={`items.${staticRowIndex}.valid_state`}
                        />
                    );
                },
            },
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
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: fields,
        enablePagination: false,
        enableRowOrdering: true,
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
