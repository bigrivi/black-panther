import { FooterToolbar, RefineListView } from "@/components";
import { IResource, IRole } from "@/interfaces";
import { Save } from "@mui/icons-material";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
    useCustomMutation,
    useHandleNotification,
    useList,
    useTranslate,
} from "@refinedev/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { Filter } from "./components/filter";
import { FlattenEditor } from "./components/flatten-editor";
import { NestedEditor } from "./components/nested-editor";
import { PolicyProviderContext } from "./context";
import { SelectedRoleActionsMap } from "./types";

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

    const filteredResources = useMemo(() => {
        if (filteredResourceIds.length > 0) {
            return resources.filter((item) =>
                filteredResourceIds.includes(item.id)
            );
        }
        return resources;
    }, [resources, filteredResourceIds]);

    const filteredRoles = useMemo(() => {
        if (filteredRoleIds.length > 0) {
            return roles.filter((item) => filteredRoleIds.includes(item.id));
        }
        return roles;
    }, [roles, filteredRoleIds]);

    const [selectedRoleActions, setSelectedRoleActions] =
        useState<SelectedRoleActionsMap>({});

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
                        [curr.id + ""]: curr.actions?.map((item) => item.id),
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
        const changeData: ChangeData = roles.reduce(
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

    const handleViewChange = (evt: any, value: View) => {
        if (value) {
            setView(value);
            localStorage.setItem("editor-view", value);
        }
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
        <PolicyProviderContext.Provider
            value={{
                resources,
                roles,
                filteredResources,
                filteredRoles,
                selectedRoleActions,
                handleActionSelectionChange,
                changedCount,
            }}
        >
            <RefineListView
                headerButtons={(props) => [
                    <Filter onChange={handleFilterChange} key="filter" />,
                    <ToggleButtonGroup
                        key="view-toggle"
                        value={view}
                        exclusive
                        onChange={handleViewChange}
                        aria-label="text alignment"
                    >
                        <ToggleButton
                            value="nested"
                            aria-label="nested view"
                            size="small"
                        >
                            <ListOutlinedIcon />
                        </ToggleButton>
                        <ToggleButton
                            value="flatten"
                            aria-label="flatten view"
                            size="small"
                        >
                            <BorderAllOutlinedIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>,
                ]}
            >
                {view == "nested" && <NestedEditor />}
                {view == "flatten" && <FlattenEditor />}

                {changedCount > 0 && (
                    <FooterToolbar>
                        <Box>
                            {t("policy.unSaveChangesCounts", { changedCount })}
                            <Button onClick={handleReset}>
                                {t("buttons.reset")}
                            </Button>
                            <Button
                                onClick={handleSave}
                                color="primary"
                                variant="contained"
                                loading={isLoading}
                                startIcon={<Save />}
                            >
                                {t("buttons.saveChanges")}
                            </Button>
                        </Box>
                    </FooterToolbar>
                )}
            </RefineListView>
        </PolicyProviderContext.Provider>
    );
};
