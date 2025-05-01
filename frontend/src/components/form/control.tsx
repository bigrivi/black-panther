import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";

type ControlProps = {};
export const Control: FC<PropsWithChildren<ControlProps>> = ({ children }) => {
    return <Box>{children}</Box>;
};
