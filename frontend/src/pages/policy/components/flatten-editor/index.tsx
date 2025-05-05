import { FC, PropsWithChildren, useMemo } from "react";
import { IResource, IRole } from "@/interfaces";
import { RoleEditor } from "./RoleEditor";
import { usePolicyProviderContext } from "../../context";
import { Stack } from "@mui/material";

type FlattenEditorProps = {};

export const FlattenEditor: FC<
    PropsWithChildren<FlattenEditorProps>
> = ({}) => {
    const { filteredResources, filteredRoles, changedCount } =
        usePolicyProviderContext();

    const maxHeight = useMemo(() => {
        if (changedCount > 0) {
            return "calc(-250px + 100vh)";
        }
        return "calc(-210px + 100vh)";
    }, [changedCount]);

    return (
        <div style={{ maxHeight, overflow: "auto", paddingRight: 0 }}>
            <Stack spacing={2}>
                {filteredRoles.map((role) => {
                    return (
                        <RoleEditor
                            key={role.id}
                            role={role}
                            resources={filteredResources}
                        />
                    );
                })}
            </Stack>
        </div>
    );
};
