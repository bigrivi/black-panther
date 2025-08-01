import { IFieldSchema } from "@/interfaces";
import { Typography } from "@mui/material";
import {
    CheckboxElement,
    SelectElement,
    TextareaAutosizeElement,
    TextFieldElement,
} from "react-hook-form-mui";
import {
    AutocompleteArrayElement,
    AutocompleteElement,
    ReferenceArrayElement,
    ReferenceElement,
    ReferenceNodeElement,
    SwitchElement,
    TreeSelectFieldElement,
} from "../form/elements";
import { ListTable } from "./list-table";

export const fieldFactory = ({
    name,
    valueType,
    options,
    schema,
    reference,
    required,
    description,
    renderHelp = true,
}: IFieldSchema & { required?: boolean; renderHelp?: boolean }) => {
    const renderBasic = () => {
        switch (valueType) {
            case "switch":
                return (
                    <SwitchElement
                        helperText={renderHelp ? description : undefined}
                        required={required}
                        style={{ width: 50 }}
                        label=""
                        name={name}
                    />
                );
            case "checkbox":
                return (
                    <CheckboxElement
                        helperText={renderHelp ? description : undefined}
                        required={required}
                        name={name}
                    />
                );
            case "select":
                return (
                    <SelectElement
                        name={name}
                        helperText={renderHelp ? description : undefined}
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
                        helperText={renderHelp ? description : undefined}
                        name={name}
                        id={name}
                    />
                );
            case "listTable":
                return (
                    <ListTable
                        required={required}
                        description={description}
                        name={name}
                        schema={schema}
                    />
                );
            default:
                return (
                    <TextFieldElement
                        helperText={renderHelp ? description : undefined}
                        required={required}
                        name={name}
                        id={name}
                    />
                );
        }
    };

    const renderReferenceChild = () => {
        switch (valueType) {
            case "select":
                return (
                    <SelectElement
                        name={name}
                        helperText={renderHelp ? description : undefined}
                        required={required}
                        fullWidth
                        labelKey="name"
                        valueKey="id"
                        options={options}
                    />
                );
            case "referenceNode":
                return (
                    <TreeSelectFieldElement
                        helperText={renderHelp ? description : undefined}
                        required={required}
                    />
                );
            case "reference":
                return <AutocompleteElement />;
            case "referenceArray":
                return <AutocompleteArrayElement />;
            default:
                return (
                    <Typography color="error">
                        unknow reference type {valueType}
                    </Typography>
                );
        }
    };

    if (reference) {
        let ReferenceComponent = ReferenceElement;
        if (valueType == "referenceNode") {
            ReferenceComponent = ReferenceNodeElement;
        } else if (valueType == "referenceArray") {
            ReferenceComponent = ReferenceArrayElement;
        }
        return (
            <ReferenceComponent name={name} resource={reference}>
                {renderReferenceChild()}
            </ReferenceComponent>
        );
    }

    return renderBasic();
};
