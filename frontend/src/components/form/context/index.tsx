import { createContext, useContext } from "react";
import { FormLayout } from "../types";

type FormContenxtType = {
    layout: FormLayout;
};

export const FormContext = createContext<FormContenxtType>(
    {} as FormContenxtType
);

export const useFormContext = () => {
    const context = useContext(FormContext);
    return context;
};
