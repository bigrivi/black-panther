import {
    InputLabelProps,
    InputLabel as MUIInputLabel,
    styled,
} from "@mui/material";
import { FC, PropsWithChildren } from "react";

const InputLabel = styled(MUIInputLabel)(({ theme }) => ({
    "&.MuiFormLabel-root": {
        transform: "translate(0px, -1.5px) scale(0.75)",
        position: "unset",
    },
    "& .MuiFormLabel-asterisk": {
        color: "rgb(185, 28, 28)",
    },
})) as typeof MUIInputLabel;

type LabelProps = {} & InputLabelProps;
export const Label: FC<PropsWithChildren<LabelProps>> = ({
    children,
    ...rest
}) => {
    return <InputLabel {...rest}>{children}</InputLabel>;
};
