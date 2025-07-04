import { useColorModeContext } from "@/contexts";
import { Stack } from "@mui/material";
import BaseDrawer, { type DrawerProps } from "@mui/material/Drawer";
import type { PropsWithChildren } from "react";
import { DrawerHeader } from "../header";

type Props = {} & DrawerProps;

export const Drawer = ({ children, ...props }: PropsWithChildren<Props>) => {
    const { mode } = useColorModeContext();

    return (
        <BaseDrawer
            {...props}
            aria-hidden={false}
            sx={{
                "& .MuiDrawer-paper": {
                    backgroundColor: mode === "light" ? "#f5f5f5" : "#000",
                },
                ...props.sx,
            }}
        >
            <Stack style={{ height: "100%" }}>
                <DrawerHeader
                    title={props.title}
                    onCloseClick={() => {
                        props.onClose && props.onClose({}, "backdropClick");
                    }}
                />
                {children}
            </Stack>
        </BaseDrawer>
    );
};
