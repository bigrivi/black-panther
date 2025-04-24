import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import {
    useCustomMutation,
    useHandleNotification,
    useList,
    useNotification,
    useTranslate,
} from "@refinedev/core";
import { type BaseRecord } from "@refinedev/core";
import {
    Button,
    Checkbox,
    CheckboxChangeEvent,
    CheckboxProps,
    Dropdown,
    Flex,
    MenuProps,
    message,
    Popconfirm,
    Space,
    Table,
} from "antd";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { useStyles } from "./styled";
import { IAction, IResource, IRole } from "@/interfaces";
import {
    CheckOutlined,
    CheckSquareFilled,
    DownOutlined,
    SaveFilled,
    SaveOutlined,
} from "@ant-design/icons";
import { API_URL } from "@/constants";
import { FooterToolbar } from "@/components/footerToolbar";

type ChangeData = Array<{
    roleId: string;
    add: number[];
    remove: number[];
}>;

const headerItems: MenuProps["items"] = [
    {
        label: "Clear Permissions",
        key: "clear",
    },
    {
        label: "Allow All",
        key: "allowAll",
    },
];

const diffActions = (oldActions: number[], newActions: number[]) => {
    return {
        remove: oldActions.filter((actionId) => !newActions.includes(actionId)),
        add: newActions.filter((actionId) => !oldActions.includes(actionId)),
    };
};

export const PolicyPage = () => {
    const t = useTranslate();
    const { styles } = useStyles();
    const [hoverColumn, setHoverColumn] = useState<number>();
    const [hoverRow, setHoverRow] = useState<number>();
    const { open } = useNotification();
    const handleNotification = useHandleNotification();
    const { mutateAsync: addOrRemovePermissions, isLoading } =
        useCustomMutation();
    const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
    const serverInitialRoleActionsRef = useRef<Record<string, number[]>>();
    const [selectedRoleActions, setSelectedRoleActions] = useState<
        Record<string, number[]>
    >({});
    const { tableProps } = useTable<IResource>({
        syncWithLocation: true,
        resource: "resource",
        pagination: { mode: "off" },
        queryOptions: {
            select: (data) => {
                let index = 0;
                data.data.forEach((resource) => {
                    resource.index = index;
                    index = index + 1;
                    resource.actions?.forEach((action, i) => {
                        action.index = index;
                        index = index + 1;
                    });
                });
                return data;
            },
        },
    });
    const { data: roleData, refetch: refetchRole } = useList<IRole>({
        resource: "role",
    });

    const changedCount = useMemo(() => {
        if (roleData?.data && serverInitialRoleActionsRef.current) {
            return roleData.data.reduce((prev, item) => {
                const roleKey = String(item.id);
                const diff = diffActions(
                    serverInitialRoleActionsRef.current![roleKey],
                    selectedRoleActions[roleKey]
                );
                const diffCount = diff.remove.length + diff.add.length;
                return prev + diffCount;
            }, 0);
        }
        return 0;
    }, [selectedRoleActions, roleData]);

    const handleActionSelectChange = (
        e: CheckboxChangeEvent,
        roleId: string,
        actionId: number,
        actions: IAction[]
    ) => {
        setSelectedRoleActions((prev) => {
            let roleActions = prev[roleId] || [];
            let changeActionIds = actions
                ? actions.map((item) => item.id)
                : [actionId];
            if (e.target.checked) {
                changeActionIds.forEach((changeActionId) => {
                    if (!roleActions.includes(changeActionId)) {
                        roleActions.push(changeActionId);
                    }
                });
            } else {
                roleActions = roleActions.filter((action) => {
                    return !changeActionIds.includes(action);
                });
            }

            return {
                ...prev,
                [roleId]: [...roleActions],
            };
        });
    };

    useEffect(() => {
        if (roleData?.data) {
            const serverInitialRoleActions: Record<string, number[]> =
                roleData?.data.reduce((acc, curr) => {
                    return {
                        ...acc,
                        [curr.id + ""]: curr.actions.map((item) => item.id),
                    };
                }, {});
            serverInitialRoleActionsRef.current = Object.keys(
                serverInitialRoleActions
            ).reduce((acc: any, key: string) => {
                return {
                    ...acc,
                    [key]: [...serverInitialRoleActions[key]],
                };
            }, {});
            setSelectedRoleActions(serverInitialRoleActions);
        }
    }, [roleData]);

    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setExpandedRowKeys(
                tableProps?.dataSource.map((item: IResource) => item.id)
            );
        }
    }, [tableProps.dataSource]);

    if (!roleData) {
        return null;
    }

    const handleHeaderClick = (key: string, roleId: number) => {
        const allActions: IAction[] | undefined =
            tableProps.dataSource?.flatMap((item) => item.actions as IAction[]);
        if (allActions && key == "allowAll") {
            setSelectedRoleActions((prev) => {
                return {
                    ...prev,
                    [roleId]: [...allActions.map((item) => item.id)],
                };
            });
        } else if (key == "clear") {
            setSelectedRoleActions((prev) => {
                return {
                    ...prev,
                    [roleId]: [],
                };
            });
        }
    };

    const handleCellMouseEnter = (row: number, col: number) => {
        setHoverColumn(col);
        setHoverRow(row);
    };

    const handleCellMouseLeave = () => {
        setHoverColumn(undefined);
        setHoverRow(undefined);
    };

    const handleReset = () => {
        setSelectedRoleActions(
            Object.keys(serverInitialRoleActionsRef.current!).reduce(
                (acc: any, key: string) => {
                    return {
                        ...acc,
                        [key]: [...serverInitialRoleActionsRef.current![key]],
                    };
                },
                {}
            )
        );
    };

    const handleSave = async () => {
        const changeData: ChangeData = roleData.data.reduce(
            (prev: ChangeData, item): ChangeData => {
                const roleKey = String(item.id);
                const diff = diffActions(
                    serverInitialRoleActionsRef.current![roleKey],
                    selectedRoleActions[roleKey]
                );
                if (diff.add.length == 0 && diff.remove.length == 0) {
                    return [...prev];
                }
                return [...prev, { roleId: roleKey, ...diff }];
            },
            []
        );

        console.log(changeData);
        const requests = changeData
            .flatMap((changeDataItem) => {
                return [
                    changeDataItem.add.length > 0
                        ? addOrRemovePermissions({
                              url: `role/${changeDataItem?.roleId}/permissions`,
                              method: "post",
                              values: changeDataItem.add,
                          })
                        : null,
                    changeDataItem.remove.length > 0
                        ? addOrRemovePermissions({
                              url: `role/${changeDataItem?.roleId}/permissions`,
                              method: "delete",
                              values: changeDataItem.remove,
                          })
                        : null,
                ];
            })
            .filter((item) => !!item);
        console.log(requests);
        try {
            await Promise.all(requests);
            refetchRole();
            handleNotification?.({
                type: "success",
                message: "Successfully saved permission changes",
                key: "notification-key",
            });
        } catch (error) {
            console.log("Error", error);
        }
    };

    return (
        <>
            <List
                headerProps={{
                    extra: <></>,
                }}
            >
                <Table
                    rowClassName={styles.row}
                    bordered
                    rowKey={(record: any) => {
                        if (record.resource_id) {
                            return record.id + "," + record.resource_id;
                        }
                        return record.id;
                    }}
                    {...tableProps}
                    scroll={{ x: 1000 }}
                    expandable={{
                        childrenColumnName: "actions",
                        indentSize: 0,
                        expandedRowKeys,
                        onExpand(expanded, record: any) {
                            let newRowKeys = expandedRowKeys;
                            if (expanded) {
                                newRowKeys = [...newRowKeys, record.id];
                            } else {
                                newRowKeys = newRowKeys.filter(
                                    (e) => e !== record.id
                                );
                            }
                            setExpandedRowKeys(newRowKeys);
                        },
                    }}
                >
                    <Table.Column
                        fixed="left"
                        dataIndex="name"
                        width={200}
                        title={"Resource"}
                        // render={(value, record: any, index) => {
                        //     if (record.actions) {
                        //         return (
                        //             <Flex align="center" style={{ height: 55 }}>
                        //                 {value}
                        //             </Flex>
                        //         );
                        //     }
                        //     return (
                        //         <Flex
                        //             align="center"
                        //             className={styles.cell}
                        //             style={{ height: 55 }}
                        //         >
                        //             {value}
                        //         </Flex>
                        //     );
                        // }}
                    />
                    {roleData.data.map((role, col) => {
                        return (
                            <Table.Column
                                width={200}
                                key={role.id}
                                className={
                                    hoverColumn == col
                                        ? styles.highlightColumn
                                        : undefined
                                }
                                render={(value, record: any, index) => {
                                    const isActive =
                                        hoverRow == record.index &&
                                        col == hoverColumn;
                                    if (record.actions) {
                                        const allChecked = record.actions.every(
                                            (action: IAction) => {
                                                return selectedRoleActions[
                                                    role.id + ""
                                                ]?.includes(action.id);
                                            }
                                        );
                                        return (
                                            <Flex
                                                justify="center"
                                                className={
                                                    isActive
                                                        ? styles.activeCell
                                                        : undefined
                                                }
                                                style={{ height: 55 }}
                                                onMouseEnter={() =>
                                                    handleCellMouseEnter(
                                                        record.index,
                                                        col
                                                    )
                                                }
                                                onMouseLeave={
                                                    handleCellMouseLeave
                                                }
                                            >
                                                <Checkbox
                                                    onChange={(e) => {
                                                        handleActionSelectChange(
                                                            e,
                                                            role.id + "",
                                                            record.id,
                                                            record.actions
                                                        );
                                                    }}
                                                    indeterminate={
                                                        record.actions.some(
                                                            (
                                                                action: IAction
                                                            ) => {
                                                                return selectedRoleActions[
                                                                    role.id + ""
                                                                ]?.includes(
                                                                    action.id
                                                                );
                                                            }
                                                        ) && !allChecked
                                                    }
                                                    checked={allChecked}
                                                />
                                            </Flex>
                                        );
                                    }
                                    return (
                                        <Flex
                                            justify="center"
                                            className={
                                                isActive
                                                    ? styles.activeCell
                                                    : undefined
                                            }
                                            style={{ height: 55 }}
                                            onMouseEnter={() =>
                                                handleCellMouseEnter(
                                                    record.index,
                                                    col
                                                )
                                            }
                                            onMouseLeave={handleCellMouseLeave}
                                        >
                                            <Checkbox
                                                onChange={(e) => {
                                                    handleActionSelectChange(
                                                        e,
                                                        role.id + "",
                                                        record.id,
                                                        record.actions
                                                    );
                                                }}
                                                checked={selectedRoleActions[
                                                    role.id + ""
                                                ]?.includes(record.id)}
                                            />
                                        </Flex>
                                    );
                                }}
                                align="center"
                                title={
                                    <Dropdown
                                        menu={{
                                            items: headerItems,
                                            onClick: (evt) => {
                                                handleHeaderClick(
                                                    evt.key,
                                                    role.id
                                                );
                                            },
                                        }}
                                        trigger={["click"]}
                                    >
                                        <Button
                                            type="text"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <Space>
                                                {role.name}
                                                <DownOutlined />
                                            </Space>
                                        </Button>
                                    </Dropdown>
                                }
                            />
                        );
                    })}

                    <Table.Column title={""} />
                </Table>
            </List>
            {changedCount > 0 && (
                <FooterToolbar>
                    <Space>
                        {changedCount} unsaved changes
                        <Button onClick={handleReset}>Reset</Button>
                        <Button
                            onClick={handleSave}
                            type="primary"
                            loading={isLoading}
                            icon={<SaveFilled />}
                        >
                            Save Changes
                        </Button>
                    </Space>
                </FooterToolbar>
            )}
        </>
    );
};
