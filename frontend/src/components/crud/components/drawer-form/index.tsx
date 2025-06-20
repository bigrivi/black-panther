import { SchemaForm } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { Button, Stack } from "@mui/material";
import { BaseKey, useTranslate } from "@refinedev/core";
import { FC } from "react";
import { useEditForm } from "../../hooks/useEditForm";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const CrudDrawerForm: FC<Props> = ({ action }) => {
    const t = useTranslate();
    const { onBack, methods, saveButtonProps, schema } = useEditForm(action);

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={true}
            title={schema?.title}
            anchor="right"
            onClose={onBack}
        >
            <DrawerContent>
                <Stack
                    bgcolor="background.paper"
                    padding="24px"
                    sx={{ flex: 1, overflow: "auto" }}
                >
                    {schema && (
                        <SchemaForm schema={schema} formContext={methods} />
                    )}
                </Stack>
            </DrawerContent>
            <DrawerFooter>
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
            </DrawerFooter>
        </Drawer>
    );
};
