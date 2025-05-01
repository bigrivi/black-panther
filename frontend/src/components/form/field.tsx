import { FormControl } from "@mui/material";
import { FC, PropsWithChildren } from "react";

type FieldProps = {};
export const Field: FC<PropsWithChildren<FieldProps>> = ({ children }) => {
    return (
        <FormControl margin="normal" fullWidth>
            {children}
        </FormControl>
    );
};
