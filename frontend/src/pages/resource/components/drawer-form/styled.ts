import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => {
    return {
        formItem: {
            backgroundColor: token.colorBgContainer,
            padding: "16px",
            margin: 0,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
        },
    };
});
