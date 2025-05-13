import { styled } from "@mui/material";
import { PropsWithChildren } from "react";

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
            marginTop: 13,
            marginBottom: 0,
        },
    };
});
