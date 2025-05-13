import { Stack } from "@mui/material";
import { FC, PropsWithChildren } from "react";

type FormFieldProps = {
    horizontal?: boolean;
};
export const FormField: FC<PropsWithChildren<FormFieldProps>> = ({
    horizontal,
    children,
}) => {
    return (
        <Stack
            className="FormField-root"
            direction={horizontal ? "row" : "column"}
        >
            {children}
        </Stack>
    );
};
