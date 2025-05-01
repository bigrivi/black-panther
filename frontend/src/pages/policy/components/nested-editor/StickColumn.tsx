import { styled } from "@mui/material";
import { tableCellClasses, TableCellProps } from "@mui/material/TableCell";
import { BorderedCell } from "./BorderedCell";
export const StickColumn = styled(({ children, ...rest }: TableCellProps) => {
    return <BorderedCell {...rest}>{children}</BorderedCell>;
})(({ theme }) => ({
    [`&.${tableCellClasses.root}`]: {
        position: "sticky",
        left: 0,
        zIndex: 1,
    },
}));
