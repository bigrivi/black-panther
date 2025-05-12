import { Stack, styled } from "@mui/material";
import { FC, PropsWithChildren } from "react";

type FormFieldProps = {
    horizontal?: boolean;
};
export const FormField: FC<PropsWithChildren<FormFieldProps>> = ({
    horizontal,
    children,
}) => {
    return <Stack direction={horizontal ? "row" : "column"}>{children}</Stack>;
};

export const FormFieldLabel = styled(
    ({ children, ...rest }: PropsWithChildren) => {
        return (
            <div
                style={{
                    textAlign: "right",
                    marginRight: 20,
                    flexGrow: 1,
                    flexShrink: 0,
                    flexBasis: 0,
                }}
                className="FormFieldLabel-root"
                {...rest}
            >
                {children}
            </div>
        );
    }
)(() => {
    return {
        [`& .MuiFormLabel-root`]: {
            marginTop: 10,
            marginBottom: 0,
        },
    };
});

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
