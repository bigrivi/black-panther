import { DeleteButton, Paper } from "@/components";
import { RefineListView } from "@/components/refine-list-view";
import { Status } from "@/components/status";
import { defaultDataTimeFormat } from "@/constants";
import { useTable } from "@/hooks";
import { IRole, IUser } from "@/interfaces";
import { KeyOutlined } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack } from "@mui/material";
import { useList, useModal, useTranslate } from "@refinedev/core";
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

    const { data: rolesData } = useList<IRole>({
        resource: "role",
        pagination: { mode: "off" },
    });

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
                accessorKey: "department",
                header: t("users.fields.department"),
                enableColumnFilter: false,
                enableSorting: false,
                Cell: function render({ row }) {
                    return row.original.department?.name ?? "";
                },
            },
            {
                accessorKey: "roles",
                header: t("users.fields.roles"),
                enableSorting: false,
                filterFn: "any",
                enableColumnFilterModes: false,
                filterSelectOptions:
                    rolesData?.data.map((item) => {
                        return { label: item.name, value: item.id + "" };
                    }) ?? [],
                filterVariant: "select",
                grow: true,
                Cell: function render({ row }) {
                    return (
                        <div>
                            {row.original.roles.map((role) => (
                                <Chip
                                    size="small"
                                    key={role.id}
                                    label={role.name}
                                />
                            ))}
                        </div>
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
        [t, rolesData]
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
                <Stack spacing={2} direction="row">
                    <Box sx={{ flexBasis: 350, overflow: "auto" }}>
                        <OrgSider
                            selectedDept={selectedDeptId}
                            onSelectedDeptChange={handleSelectedDeptIdChange}
                        />
                    </Box>
                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                        <Paper>
                            <MaterialReactTable table={table} />
                        </Paper>
                    </Box>
                </Stack>
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
