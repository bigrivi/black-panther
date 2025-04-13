import { type AccessControlProvider } from "@refinedev/core";

export interface AccessControlProviderHookResult {
    accessControlProvider: AccessControlProvider;
}
export const useAccessControlProvider = (
    user: any
): AccessControlProviderHookResult => {
    const accessControlProvider: AccessControlProvider = {
        can: async ({ resource, action }) => {
            // if (resource == "post" && action == "list") {
            //     return {
            //         can: false,
            //         reason: "Unauthorized",
            //     };
            // }
            return { can: true };
        },
        options: {
            buttons: {
                enableAccessControl: true,
                hideIfUnauthorized: true,
            },
            queryOptions: {
                // ... default global query options
            },
        },
    };

    return {
        accessControlProvider,
    };
};
