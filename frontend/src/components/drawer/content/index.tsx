import { Stack } from "@mui/material";
import { FC, PropsWithChildren } from "react";

type Props = {};

export const DrawerContent: FC<PropsWithChildren<Props>> = ({ children }) => {
    return (
        <Stack padding="24px" sx={{ flex: 1 }}>
            {children}
        </Stack>
    );
};
