import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, isDarkMode }) => ({
    root: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        background: isDarkMode ? "#1f1f1f" : "#ffffff",
        height: 64,
        padding: 16,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        borderTop: "1px solid " + token.colorBorder,
        boxShadow: token.boxShadow,
    },
}));
