import { styled } from "@mui/material";
import { FC, PropsWithChildren } from "react";

const StyleFormFieldBody = styled("div")(() => ({
    flexGrow: 5,
    flexShrink: 1,
    flexBasis: 0,
}));

export const FormFieldBody: FC<PropsWithChildren> = ({ children }) => {
    return (
        <StyleFormFieldBody className="FormFieldBody-root">
            {children}
        </StyleFormFieldBody>
    );
};
