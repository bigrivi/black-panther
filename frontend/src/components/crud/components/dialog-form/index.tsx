import { SchemaForm } from "@/components";
import { DrawerHeader } from "@/components/drawer";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Stack,
} from "@mui/material";
import { BaseKey, useTranslate } from "@refinedev/core";
import { FC } from "react";
import { useEditForm } from "../../hooks/useEditForm";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const CrudDialogForm: FC<Props> = ({ action }) => {
    const t = useTranslate();
    const { onBack, methods, saveButtonProps, schema, title } =
        useEditForm(action);

    return (
        <Dialog
            open={true}
            onClose={onBack}
            slotProps={{ paper: { sx: { minWidth: 700 } } }}
        >
            <DrawerHeader
                title={title}
                onCloseClick={() => {
                    onBack();
                }}
            />
            <DialogContent>
                {schema && <SchemaForm schema={schema} formContext={methods} />}
            </DialogContent>
            <Divider />
            <DialogActions>
                <Stack direction="row">
                    <Button onClick={onBack}>{t("buttons.cancel")}</Button>
                    <Button
                        {...saveButtonProps}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        {t("buttons.save")}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
