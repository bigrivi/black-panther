import { IFieldSchema } from "@/interfaces";
import {
    CheckboxElement,
    SelectElement,
    TextareaAutosizeElement,
    TextFieldElement,
} from "react-hook-form-mui";
import {
    AutocompleteElement,
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
            case "treeSelect":
                return (
                    <TreeSelectFieldElement
                        helperText={renderHelp ? description : undefined}
                        required={required}
                    />
                );
            case "autocomplete":
                return <AutocompleteElement />;
            default:
                return <></>;
        }
    };

    if (reference) {
        let ReferenceComponent = ReferenceElement;
        if (valueType == "treeSelect") {
            ReferenceComponent = ReferenceNodeElement;
        }
        return (
            <ReferenceComponent name={name} resource={reference}>
                {renderReferenceChild()}
            </ReferenceComponent>
        );
    }

    return renderBasic();
};
