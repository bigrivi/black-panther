import { List } from "@refinedev/antd";
import {
    useCustomMutation,
    useHandleNotification,
    useList,
    useTranslate,
} from "@refinedev/core";
import { Button, Segmented, Space } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { IResource, IRole } from "@/interfaces";
import {
    AppstoreOutlined,
    SaveFilled,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { FooterToolbar } from "@/components/footerToolbar";
import { NestedEditor } from "./components/nested-editor";
import { FlattenEditor } from "./components/flatten-editor";
import { Filter } from "./components/filter";

type ChangeData = Array<{
    roleId: string;
    add: number[];
    remove: number[];
}>;

type View = "nested" | "flatten";

const diffActions = (oldActions: number[], newActions: number[]) => {
    return {
        remove: oldActions.filter((actionId) => !newActions.includes(actionId)),
        add: newActions.filter((actionId) => !oldActions.includes(actionId)),
    };
};

export const PolicyPage = () => {
    const t = useTranslate();
    const serverInitialRoleActionsRef = useRef<Record<string, number[]>>();
    const handleNotification = useHandleNotification();
    const { mutateAsync: addOrRemovePermissions, isLoading } =
        useCustomMutation();
    const [view, setView] = useState<View>(
        (localStorage.getItem("editor-view") as View) || "nested"
    );
    const [filteredRoleIds, setFilteredRoleIds] = useState<number[]>([]);
    const [filteredResourceIds, setFilteredResourceIds] = useState<number[]>(
        []
    );

    const { data: roleData, refetch: refetchRole } = useList<IRole>({
        resource: "role",
        pagination: {
            mode: "off",
        },
    });

    const { data: resourceData } = useList<IResource>({
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

    const resources = useMemo(() => {
        return resourceData?.data || [];
    }, [resourceData]);

    const roles = useMemo(() => {
        return roleData?.data || [];
    }, [roleData]);

    const [selectedRoleActions, setSelectedRoleActions] = useState<
        Record<string, number[]>
    >({});

    const changedCount = useMemo(() => {
        if (roles && serverInitialRoleActionsRef.current) {
            return roles.reduce((prev, item) => {
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
    }, [selectedRoleActions, roles]);

    const handleActionSelectionChange = (
        checked: boolean,
        roleId: number,
        actionIds: number[]
    ) => {
        setSelectedRoleActions((prev) => {
            let newRoleActions = prev[roleId + ""] || [];
            if (checked) {
                actionIds.forEach((changeActionId) => {
                    if (!newRoleActions.includes(changeActionId)) {
                        newRoleActions.push(changeActionId);
                    }
                });
            } else {
                newRoleActions = newRoleActions.filter((action) => {
                    return !actionIds.includes(action);
                });
            }

            return {
                ...prev,
                [roleId + ""]: [...newRoleActions],
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

    if (!roleData) {
        return null;
    }

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

    const handleViewChange = (value: View) => {
        setView(value);
        localStorage.setItem("editor-view", value);
    };

    const handleFilterChange = (filterValues: string[]) => {
        setFilteredRoleIds(
            filterValues
                .filter((item) => item.startsWith("role_"))
                .map((item) => Number(item.replace("role_", "")))
        );
        setFilteredResourceIds(
            filterValues
                .filter((item) => item.startsWith("resource_"))
                .map((item) => Number(item.replace("resource_", "")))
        );
    };

    return (
        <>
            <List
                headerButtons={(props) => [
                    <Filter
                        onChange={handleFilterChange}
                        resources={resources}
                        roles={roles}
                        key="filter"
                    />,
                    <Segmented<View>
                        key="view"
                        size="large"
                        value={view}
                        options={[
                            {
                                label: "",
                                value: "nested",
                                icon: <UnorderedListOutlined />,
                            },
                            {
                                label: "",
                                value: "flatten",
                                icon: <AppstoreOutlined />,
                            },
                        ]}
                        onChange={handleViewChange}
                    />,
                ]}
            ></List>
            {view == "nested" && (
                <NestedEditor
                    resources={resources}
                    roles={roles}
                    filteredResourceIds={filteredResourceIds}
                    filteredRoleIds={filteredRoleIds}
                    changedCount={changedCount}
                    selectedRoleActions={selectedRoleActions}
                    onActionSelectionChange={handleActionSelectionChange}
                />
            )}
            {view == "flatten" && (
                <FlattenEditor
                    filteredResourceIds={filteredResourceIds}
                    filteredRoleIds={filteredRoleIds}
                    resources={resources}
                    roles={roles}
                    selectedRoleActions={selectedRoleActions}
                    onActionSelectionChange={handleActionSelectionChange}
                />
            )}

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
