import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    root: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: token.colorWhite,
        height: 64,
        padding: 16,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        borderTop: "1px solid #e8e8e8",
        boxShadow: "0 -1px 2px rgba(0,0,0,.03)",
    },
}));
