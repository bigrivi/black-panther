import { Space } from "antd";
import { FC, PropsWithChildren, useMemo } from "react";
import { IResource, IRole } from "@/interfaces";
import { RoleEditor } from "./RoleEditor";

type FlattenEditorProps = {
    roles: IRole[];
    resources: IResource[];
    filteredRoleIds: number[];
    filteredResourceIds: number[];
    selectedRoleActions: Record<string, number[]>;
    onActionSelectionChange: (
        checked: boolean,
        roleId: number,
        actionIds: number[]
    ) => void;
};

export const FlattenEditor: FC<PropsWithChildren<FlattenEditorProps>> = ({
    resources,
    roles,
    filteredResourceIds,
    filteredRoleIds,
    selectedRoleActions,
    onActionSelectionChange,
}) => {
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

    return (
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            {filteredRoles.map((role) => {
                return (
                    <RoleEditor
                        key={role.id}
                        role={role}
                        resources={filteredResources}
                        onActionSelectionChange={onActionSelectionChange}
                        selectedRoleActions={selectedRoleActions}
                    />
                );
            })}
        </Space>
    );
};
