import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, isDarkMode }) => {
    return {
        table: {
            "thead th": {
                "&:not(:first-child)": {
                    padding: "0px !important",
                },
                "&:hover": {
                    background: token["purple-2"] + "!important",
                },
            },
            "& .ant-table-body": {
                borderBottom: "1px solid",
                borderBottomColor: "var(--ant-table-border-color)",
            },
        },
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
                    background: isDarkMode ? "#1d1d1d" : "#fafafa",
                },
            },
            "&:hover td": {
                background: token["purple-2"] + "!important",
                boxSizing: "border-box",
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
        headerCell: {
            height: "45px !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
        },
    };
});
