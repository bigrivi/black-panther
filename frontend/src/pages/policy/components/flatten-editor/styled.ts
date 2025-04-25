import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, isDarkMode }) => {
    return {
        table: {
            "thead th": {
                padding: "0px !important",
                "&:hover": {
                    background: token["purple-2"] + "!important",
                },
            },
        },
        row: {
            "&>td": {
                boxSizing: "border-box",
            },
        },

        headerCell: {
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            height: 55,
            paddingLeft: 16,
        },
    };
});
