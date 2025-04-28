import { IResource, IRole } from "@/interfaces";
import { createContext, useContext } from "react";
import { SelectedRoleActionsMap } from "./types";

type PolicyProviderType = {
    resources: IResource[];
    filteredResources: IResource[];
    roles: IRole[];
    filteredRoles: IRole[];
    selectedRoleActions: SelectedRoleActionsMap;
    handleActionSelectionChange: (
        checked: boolean,
        roleId: number,
        actionIds: number[]
    ) => void;
    changedCount: number;
};

export const PolicyProviderContext = createContext<PolicyProviderType>(
    {} as PolicyProviderType
);

export const usePolicyProviderContext = () => {
    const context = useContext(PolicyProviderContext);
    return context;
};
