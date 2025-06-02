import { ConfirmButton, Paper } from "@/components";
import { IEnumOption } from "@/interfaces";
import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import {
    MaterialReactTable,
    MRT_ColumnDef,
    useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { SwitchElement, TextFieldElement } from "react-hook-form-mui";

export const EnumOptionsField = () => {
    const { fields, append, remove, move } = useFieldArray({
        name: "items",
        keyName: "key",
    });
    const columns = useMemo<MRT_ColumnDef<IEnumOption>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Name",
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
                header: "Value",
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
                header: "Description",
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
                header: "Status",
                enableColumnActions: false,
                Cell: function render({ row, staticRowIndex }) {
                    return (
                        <SwitchElement
                            label="Enable"
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
