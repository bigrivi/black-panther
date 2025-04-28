import { Space } from "antd";
import { FC, PropsWithChildren, useMemo } from "react";
import { IResource, IRole } from "@/interfaces";
import { RoleEditor } from "./RoleEditor";
import { useStyles } from "./styled";
import { usePolicyProviderContext } from "../../context";

type FlattenEditorProps = {};

export const FlattenEditor: FC<
    PropsWithChildren<FlattenEditorProps>
> = ({}) => {
    const { styles } = useStyles();
    const {
        filteredResources,
        filteredRoles,
        selectedRoleActions,
        changedCount,
    } = usePolicyProviderContext();

    const maxHeight = useMemo(() => {
        if (changedCount > 0) {
            return "calc(-250px + 100vh)";
        }
        return "calc(-195px + 100vh)";
    }, [changedCount]);

    return (
        <Space
            style={{ maxHeight }}
            className={styles.root}
            direction="vertical"
            size="middle"
        >
            {filteredRoles.map((role) => {
                return (
                    <RoleEditor
                        key={role.id}
                        role={role}
                        resources={filteredResources}
                        selectedRoleActions={selectedRoleActions}
                    />
                );
            })}
        </Space>
    );
};
