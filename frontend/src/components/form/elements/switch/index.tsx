import {
    FormControlLabel,
    FormControlLabelProps,
    FormHelperText,
    Switch,
    SwitchProps,
    useForkRef,
} from "@mui/material";
import { ChangeEvent, forwardRef, Ref, RefAttributes } from "react";
import {
    Control,
    FieldPath,
    FieldValues,
    PathValue,
    useController,
} from "react-hook-form";
import { useTransform } from "react-hook-form-mui";

export type SwitchElementProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
> = Omit<FormControlLabelProps, "control"> & {
    name: TName;
    control?: Control<TFieldValues>;
    switchProps?: SwitchProps;
    helperText?: string;
    transform?: {
        input?: (value: PathValue<TFieldValues, TName>) => TValue;
        output?: (
            event: ChangeEvent<HTMLInputElement>,
            checked: boolean
        ) => PathValue<TFieldValues, TName>;
    };
};

type SwitchElementComponent = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
>(
    props: SwitchElementProps<TFieldValues, TName, TValue> &
        RefAttributes<HTMLLabelElement>
) => JSX.Element;

const SwitchElement = forwardRef(function SwitchElement<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TValue = unknown
>(
    props: SwitchElementProps<TFieldValues, TName, TValue>,
    ref: Ref<HTMLLabelElement>
) {
    const { name, control, switchProps, transform, helperText, ...rest } =
        props;

    const { field } = useController({
        name,
        control,
        disabled: rest.disabled,
    });

    const { value, onChange } = useTransform<TFieldValues, TName, TValue>({
        value: field.value,
        onChange: field.onChange,
        transform: {
            input: transform?.input,
            output:
                typeof transform?.output === "function"
                    ? transform.output
                    : (
                          _event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                      ) => {
                          return checked as PathValue<TFieldValues, TName>;
                      },
        },
    });

    const handleSwitchRef = useForkRef(field.ref, switchProps?.ref);

    return (
        <>
            <FormControlLabel
                ref={ref}
                control={
                    <Switch
                        {...switchProps}
                        name={field.name}
                        value={value}
                        onChange={(event, checked) => {
                            onChange(event, checked);
                            if (typeof switchProps?.onChange === "function") {
                                switchProps.onChange(event, checked);
                            }
                        }}
                        onBlur={(event) => {
                            field.onBlur();
                            if (typeof switchProps?.onBlur === "function") {
                                switchProps?.onBlur(event);
                            }
                        }}
                        ref={handleSwitchRef}
                        checked={!!value}
                    />
                }
                {...rest}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </>
    );
});
SwitchElement.displayName = "SwitchElement";
export default SwitchElement as SwitchElementComponent;
