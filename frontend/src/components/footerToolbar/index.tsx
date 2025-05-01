import { styled } from "@mui/material";
import type { FC, PropsWithChildren } from "react";

type Props = {
    children?: React.ReactNode;
};

export const FooterToolbar = styled("div")(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    background: "#ffffff",
    height: 64,
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTop: "1px solid rgb(234, 221, 215)",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px -4px 4px",
}));
