import { SchemaForm } from "@/components";
import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
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
            <DialogTitle>
                <Stack direction="row" gap={1} alignItems="center">
                    {title}
                </Stack>
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onBack}
                sx={(theme) => ({
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                {schema && <SchemaForm schema={schema} formContext={methods} />}
            </DialogContent>
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
