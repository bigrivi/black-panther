import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, isDarkMode }) => {
    return {
        row: {
            "&>td": {
                "&:not(:first-child)": {
                    padding: "0px !important",
                },
                height: "55px !important",
                boxSizing: "border-box",
            },
            "&.ant-table-row-level-1": {
                "&>td": {
                    // background: token["gold-1"],
                },
            },
            "&:hover td": {
                background: token["purple-2"] + "!important",
            },
        },
        highlightColumn: {
            background: token["purple-2"] + "!important",
            // background: "var(--ant-table-row-hover-bg)",
            padding: "0px !important",
        },
        activeCell: {
            background: token.purple3,
        },
    };
});
