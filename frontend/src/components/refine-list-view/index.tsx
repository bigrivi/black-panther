import { List, type ListProps } from "@refinedev/mui";

type Props = {} & ListProps;

export const RefineListView = ({ children, ...props }: Props) => {
    return (
        <List
            {...props}
            headerProps={{
                sx: {
                    display: "flex",
                    flexWrap: "wrap",
                    ".MuiCardHeader-action": {
                        margin: 0,
                        alignSelf: "center",
                    },
                    height: "72px",
                    padding: 0,
                },
            }}
            headerButtonProps={{
                alignItems: "center",
                ...props.headerButtonProps,
            }}
            contentProps={{
                sx: {},
            }}
            wrapperProps={{
                sx: {
                    backgroundColor: "transparent",
                    backgroundImage: "none",
                    boxShadow: "none",
                    padding: 0,
                    ".MuiCardContent-root": {
                        padding: "0px",
                        paddingBottom: 0,
                    },
                    ".MuiBreadcrumbs-root": {
                        padding: 0,
                    },
                    ...props.wrapperProps?.sx,
                },
            }}
        >
            {children}
        </List>
    );
};
