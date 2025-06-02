import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
    return {
        sidebar: {
            padding: 10,
            transition: "width 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)",
        },
        popup: {
            zIndex: 9999,
            "& .MuiListItemButton-root": {
                transition: "background 300ms linear",
                borderRadius: "4px",
            },
            "& .MuiPaper-root": {
                borderRadius: 10,
            },
        },
        menu: {
            "& .MuiListItemButton-root": {
                transition: "background 300ms linear",
                paddingTop: 4,
                paddingBottom: 4,
                "&.isSubMenuActive": {
                    "& .MuiListItemIcon-root": {},
                },

                "& .MuiListItemIcon-root": {
                    padding: 0,
                    marginRight: 15,
                    justifyContent: "center",
                    minWidth: 24,
                    transition: "color 300ms linear",
                },
                "&:hover": {
                    borderRadius: "8px",
                },
                "&.Mui-selected": {
                    borderRadius: "8px",
                },
            },
        },
    };
});

export default useStyles;
