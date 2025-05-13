import {
    FormControl as MuiFormControl,
    FormControlProps as MuiFormControlProps,
    styled,
} from "@mui/material";
import { PropsWithChildren } from "react";

type FormControlProps = {} & MuiFormControlProps;
export const FormControl = styled(
    ({ children, ...rest }: PropsWithChildren<FormControlProps>) => {
        return (
            <MuiFormControl fullWidth {...rest}>
                {children}
            </MuiFormControl>
        );
    }
)(() => {
    return {
        ["& .MuiFormHelperText-root"]: {
            marginLeft: 0,
        },
    };
});
