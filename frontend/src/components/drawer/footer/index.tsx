import Close from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
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
