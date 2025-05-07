import { FormControl, FormControlProps } from "@mui/material";
import { FC, PropsWithChildren } from "react";

type FieldProps = {} & FormControlProps;
export const Field: FC<PropsWithChildren<FieldProps>> = ({
    children,
    margin,
}) => {
    return (
        <FormControl margin={margin} fullWidth>
            {children}
        </FormControl>
    );
};
