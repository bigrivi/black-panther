import { Padding } from "@mui/icons-material";
import { alpha, darken, lighten, styled, TableCell } from "@mui/material";
import { tableCellClasses, TableCellProps } from "@mui/material/TableCell";

export const BorderedCell = styled(({ children, ...rest }: TableCellProps) => {
    return <TableCell {...rest}>{children}</TableCell>;
})(({ theme }) => ({
    [`&.${tableCellClasses.root}`]: {
        borderBottom: `1px solid ${
            theme.palette.mode === "light"
                ? lighten(alpha(theme.palette.divider, 1), 0.88)
                : darken(alpha(theme.palette.divider, 1), 0.68)
        }`,
        borderRight: `1px solid ${
            theme.palette.mode === "light"
                ? lighten(alpha(theme.palette.divider, 1), 0.88)
                : darken(alpha(theme.palette.divider, 1), 0.68)
        }`,
    },
    ["&.hover:hover"]: {
        cursor: "pointer",
        background:
            theme.palette.mode === "light"
                ? `${lighten(
                      alpha(theme.palette.primary.main, 1),
                      0.9
                  )} !important`
                : `${darken(
                      alpha(theme.palette.primary.main, 1),
                      0.9
                  )} !important`,
    },
    ["&.highlight"]: {
        background:
            theme.palette.mode === "light"
                ? `${lighten(
                      alpha(theme.palette.primary.main, 1),
                      0.9
                  )} !important`
                : `${darken(
                      alpha(theme.palette.primary.main, 1),
                      0.9
                  )} !important`,
    },
    ["&.highlight-both"]: {
        background:
            theme.palette.mode === "light"
                ? `${lighten(
                      alpha(theme.palette.primary.main, 1),
                      0.7
                  )} !important`
                : `${darken(
                      alpha(theme.palette.primary.main, 1),
                      0.7
                  )} !important`,
    },
}));
