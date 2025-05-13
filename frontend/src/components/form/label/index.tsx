import {
    InputLabelProps,
    InputLabel as MUIInputLabel,
    styled,
} from "@mui/material";
import { FC, PropsWithChildren } from "react";

const InputLabel = styled(MUIInputLabel)(({ theme }) => ({
    "&.MuiFormLabel-root": {
        marginBottom: 8,
        fontSize: "0.875rem",
        fontWeight: 700,
        width: 150,
    },
    "& .MuiFormLabel-asterisk": {
        color: "rgb(185, 28, 28)",
    },
})) as typeof MUIInputLabel;

type FormLabelLabelProps = {} & InputLabelProps;
export const FormLabel: FC<PropsWithChildren<FormLabelLabelProps>> = ({
    children,
    ...rest
}) => {
    return <InputLabel {...rest}>{children}</InputLabel>;
};
