import { IFieldSchema } from "@/interfaces";
import {
    CheckboxElement,
    SelectElement,
    SwitchElement,
    TextareaAutosizeElement,
    TextFieldElement,
} from "react-hook-form-mui";
import { ListTable } from "./list-table";

export const fieldFactory = ({
    name,
    valueType,
    options,
    schema,
    required,
}: IFieldSchema & { required?: boolean }) => {
    switch (valueType) {
        case "switch":
            return (
                <SwitchElement
                    required={required}
                    style={{ width: 50 }}
                    label=""
                    name={name}
                />
            );
        case "checkbox":
            return <CheckboxElement required={required} name={name} />;
        case "select":
            return (
                <SelectElement
                    name={name}
                    required={required}
                    fullWidth
                    labelKey="label"
                    valueKey="value"
                    options={options}
                />
            );
        case "textarea":
            return (
                <TextareaAutosizeElement
                    hiddenLabel
                    required={required}
                    maxRows={3}
                    name={name}
                    id={name}
                />
            );
        case "listTable":
            return <ListTable name={name} schema={schema} />;
        default:
            return (
                <TextFieldElement required={required} name={name} id={name} />
            );
    }
};
