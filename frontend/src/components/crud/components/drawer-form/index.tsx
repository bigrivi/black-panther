import { SchemaForm } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { Button, Stack } from "@mui/material";
import { BaseKey, useTranslate } from "@refinedev/core";
import { FC } from "react";
import { useModuleForm } from "../../hooks/useModuleForm";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const CrudDrawerForm: FC<Props> = ({ action }) => {
    const t = useTranslate();
    const { onClose, methods, saveButtonProps, schema, title } =
        useModuleForm(action);

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open
            title={title}
            anchor="right"
            onClose={onClose}
        >
            <DrawerContent>
                {schema && <SchemaForm schema={schema} formContext={methods} />}
            </DrawerContent>
            <DrawerFooter>
                <Stack direction="row">
                    <Button onClick={onClose}>{t("buttons.cancel")}</Button>
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
