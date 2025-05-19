import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { FC, PropsWithChildren } from "react";

type Props = {};

export const DrawerFooter: FC<PropsWithChildren<Props>> = ({ children }) => {
    return (
        <>
            <Divider />
            <Box
                display="flex"
                borderRadius="0"
                height="60px"
                alignItems="center"
                justifyContent="flex-end"
                px="24px"
                bgcolor="background.paper"
            >
                {children}
            </Box>
        </>
    );
};
