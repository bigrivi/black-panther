import { DeleteButton, Paper, ReferenceFilter, Split } from "@/components";
import { ReferenceNodeFilter } from "@/components/filter";
import { RefineListView } from "@/components/refine-list-view";
import { Status } from "@/components/status";
import { defaultDataTimeFormat } from "@/constants";
import { useTable } from "@/hooks";
import { IUser } from "@/interfaces";
import { KeyOutlined } from "@mui/icons-material";
import { Box, Chip, IconButton } from "@mui/material";
import { useModal, useTranslate } from "@refinedev/core";
import {
    CreateButton,
    DateField,
    EditButton,
    RefreshButton,
} from "@refinedev/mui";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { PropsWithChildren, useMemo, useState } from "react";
import { OrgSider } from "./components/org-sider";
import { PasswordModifyForm } from "./components/password";

export const UserList = ({ children }: PropsWithChildren) => {
    const t = useTranslate();
    const [selectedDeptId, setSelectedDeptId] = useState<string>("");
    const { visible, show, close } = useModal();
    const [editId, setEditId] = useState<number>();
    const columns = useMemo<MRT_ColumnDef<IUser>[]>(
        () => [
            {
                accessorKey: "login_name",
                header: t("users.fields.loginName"),
                size: 200,
            },
            {
                accessorKey: "user_name",
                header: t("users.fields.userName"),
                width: 200,
            },
            {
                accessorKey: "email",
                header: t("users.fields.email"),
                width: 150,
            },
            {
                accessorKey: "department_id",
                header: t("users.fields.department"),
                enableColumnFilterModes: false,
                filterFn: "equals",
                enableSorting: false,
                Cell: function render({ row }) {
                    return row.original.department?.name ?? "";
                },
                Filter: ({ header }) => (
                    <ReferenceNodeFilter
                        header={header}
                        resource="department"
                    />
                ),
            },
            {
                accessorKey: "roles",
                header: t("users.fields.roles"),
                enableSorting: false,
                filterFn: "any",
                grow: true,
                enableColumnFilterModes: false,
                Filter: ({ header }) => (
                    <ReferenceFilter header={header} resource="role" />
                ),
                Cell: function render({ row }) {
                    return (
                        <Box display={"flex"} flexWrap={"wrap"} gap={"2px"}>
                            {row.original.roles.map((role) => (
                                <Chip
                                    size="small"
                                    key={role.id}
                                    label={role.name}
                                />
                            ))}
                        </Box>
                    );
                },
            },
            {
                accessorKey: "positions",
                header: t("users.fields.positions"),
                enableSorting: false,
                filterFn: "any",
                enableColumnFilterModes: false,
                grow: true,
                Filter: ({ header }) => (
                    <ReferenceFilter header={header} resource="position" />
                ),
                Cell: function render({ row }) {
                    return (
                        <Box display={"flex"} flexWrap={"wrap"} gap={"2px"}>
                            {row.original.positions.map((role) => (
                                <Chip
                                    size="small"
                                    key={role.id}
                                    label={role.name}
                                />
                            ))}
                        </Box>
                    );
                },
            },

            {
                accessorKey: "created_at",
                accessorFn: (row) => new Date(row.created_at),
                header: t("fields.createdAt"),
                size: 200,
                filterFn: "between",
                filterVariant: "datetime-range",
                Cell: function render({ row }) {
                    return (
                        <DateField
                            value={row.original.created_at}
                            format={defaultDataTimeFormat}
                        />
                    );
                },
            },
            {
                accessorKey: "is_active",
                enableColumnFilterModes: false,
                filterSelectOptions: [
                    {
                        label: t(`fields.status.true`),
                        value: "1",
                    },
                    {
                        label: t(`fields.status.false`),
                        value: "0",
                    },
                ],
                filterVariant: "select",
                header: t("fields.status.label"),
                size: 150,
                Cell: ({ row }) => {
                    return <Status value={row.original.is_active!} />;
                },
            },
            {
                accessorKey: "actions",
                header: t("table.actions"),
                enableColumnFilter: false,
                enableSorting: false,
                size: 150,
                Cell: function render({ row }) {
                    return (
                        <>
                            <EditButton
                                hideText
                                recordItemId={row.original.id}
                            />
                            <DeleteButton
                                disabled={row.original.is_superuser}
                                hideText
                                recordItemId={row.original.id}
                            />
                            <IconButton
                                disabled={row.original.is_superuser}
                                onClick={() => {
                                    setEditId(row.original.id);
                                    show();
                                }}
                                color="primary"
                            >
                                <KeyOutlined />
                            </IconButton>
                        </>
                    );
                },
            },
        ],
        [t]
    );

    const {
        refineCore: { setFilters, tableQuery },
        ...table
    } = useTable({
        columns,
        enableColumnPinning: true,
        enableRowSelection: (row) => !row.original.is_superuser!,
        getRowId: (originalRow) => {
            return originalRow.id + "";
        },
        initialState: { columnPinning: { right: ["actions"] } },
    });

    const handleSelectedDeptIdChange = (deptId: string) => {
        if (deptId != selectedDeptId) {
            setSelectedDeptId(deptId);
            setFilters([
                {
                    field: "department.path",
                    value: deptId,
                    operator: "startswiths",
                },
            ]);
        } else {
            setSelectedDeptId("");
            setFilters([
                {
                    field: "department.path",
                    value: undefined,
                    operator: "startswiths",
                },
            ]);
        }
    };

    return (
        <>
            <RefineListView
                headerButtons={(props) => {
                    return [
                        <CreateButton key={"create"} />,
                        <RefreshButton
                            onClick={() => tableQuery.refetch()}
                            key={"refresh"}
                        />,
                    ];
                }}
            >
                <Split>
                    <Box>
                        <OrgSider
                            selectedDept={selectedDeptId}
                            onSelectedDeptChange={handleSelectedDeptIdChange}
                        />
                    </Box>
                    <Box>
                        <Paper>
                            <MaterialReactTable table={table} />
                        </Paper>
                    </Box>
                </Split>
            </RefineListView>
            {visible && (
                <PasswordModifyForm
                    id={editId}
                    isOpen={visible}
                    onClose={close}
                />
            )}
            {children}
        </>
    );
};
