import { createContext, useContext } from "react";

type HighLightRowColumnContenxt = {
    row?: number;
    column?: number;
    setColumn: (column?: number) => void;
    setRow: (row?: number) => void;
};

export const HighLightRowColumnContext =
    createContext<HighLightRowColumnContenxt>({} as HighLightRowColumnContenxt);

export const useHighLightRowColumnContext = () => {
    const context = useContext(HighLightRowColumnContext);
    return context;
};
