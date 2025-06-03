import { type AccessControlProvider } from "@refinedev/core";

interface AccessControlProviderHookResult {
    accessControlProvider: AccessControlProvider;
}
export const useAccessControlProvider = (
    user: any
): AccessControlProviderHookResult => {
    const accessControlProvider: AccessControlProvider = {
        can: async ({ resource, action }) => {
            if (!user) {
                return {
                    can: false,
                    reason: "Unauthorized",
                };
            }
            const { permissions } = user;
            const permissionKey = `${resource}:${action}`;
            if (!permissions.includes(permissionKey)) {
                return {
                    can: false,
                    reason: "Unauthorized",
                };
            }
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
