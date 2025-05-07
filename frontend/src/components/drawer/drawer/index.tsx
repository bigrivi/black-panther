import BaseDrawer, { type DrawerProps } from "@mui/material/Drawer";
import type { PropsWithChildren } from "react";
import gray from "@mui/material/colors/grey";
import { useColorModeContext } from "@/contexts";
import { Stack } from "@mui/material";
import { DrawerHeader } from "../header";

type Props = {} & DrawerProps;

export const Drawer = ({ children, ...props }: PropsWithChildren<Props>) => {
    const { mode } = useColorModeContext();

    return (
        <BaseDrawer
            {...props}
            sx={{
                "& .MuiDrawer-paper": {
                    backgroundColor: mode === "light" ? gray[100] : "#000",
                },
                ...props.sx,
            }}
        >
            <Stack style={{ height: "100%" }}>
                <DrawerHeader
                    title={props.title}
                    onCloseClick={props.onClose}
                />
                {children}
            </Stack>
        </BaseDrawer>
    );
};
