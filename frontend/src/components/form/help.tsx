import {
    FormHelperTextProps,
    FormHelperText as MUIFormHelperText,
    styled,
} from "@mui/material";
import { FC, PropsWithChildren } from "react";

const FormHelperText = styled(MUIFormHelperText)(({ theme }) => ({
    "&.MuiFormHelperText-root": {
        marginLeft: 0,
    },
})) as typeof MUIFormHelperText;

export const Help: FC<PropsWithChildren<FormHelperTextProps>> = ({
    children,
    ...rest
}) => {
    return <FormHelperText {...rest}>{children}</FormHelperText>;
};
