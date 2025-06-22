import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { TreeSelectFieldElement } from "@/components/form/elements";
import { useEditForm, useUrlSearchQuery } from "@/hooks";
import { IDepartment, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import { BaseKey, HttpError, useCustom, useTranslate } from "@refinedev/core";
import { FC, useMemo } from "react";
import { SwitchElement, TextFieldElement } from "react-hook-form-mui";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const DeptDrawerForm: FC<Props> = ({ action }) => {
    const query = useUrlSearchQuery();
    const t = useTranslate();

    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        close,
        ...methods
    } = useEditForm<IDepartment, HttpError, Nullable<IDepartment>>({
        action,
        defaultValues: {
            name: "",
            valid_state: true,
            parent_id: query.get("parent_id")
                ? Number(query.get("parent_id"))
                : null,
        },
    });

    const { data: deptTreeData } = useCustom<IDepartment[]>({
        url: `department/tree`,
        method: "get",
        config: {
            query: {
                exclude_id: id,
            },
        },
    });

    const treeData = useMemo(() => {
        return deptTreeData?.data ?? [];
    }, [deptTreeData]);

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={true}
            title={
                id
                    ? t("departments.actions.edit")
                    : t("departments.actions.add")
            }
            anchor="right"
            onClose={close}
        >
            <DrawerContent>
                <Form
                    formContext={methods}
                    onSuccess={(data) => {
                        onFinish(data);
                    }}
                >
                    <FormItem
                        label={t("departments.fields.name")}
                        required
                        htmlFor="name"
                    >
                        <TextFieldElement name="name" id="name" />
                    </FormItem>
                    <FormItem label={t("fields.status.label")}>
                        <SwitchElement
                            label={t("fields.status.true")}
                            name={`valid_state`}
                        />
                    </FormItem>
                    <FormItem
                        label={t("departments.fields.parent")}
                        htmlFor="parent_id"
                    >
                        <TreeSelectFieldElement
                            name="parent_id"
                            placeholder="Root"
                            fieldNames={{
                                label: "name",
                                value: "id",
                                children: "children",
                            }}
                            treeData={treeData}
                            id="parent_id"
                        />
                    </FormItem>
                </Form>
            </DrawerContent>
            <DrawerFooter>
                <Stack direction="row">
                    <Button onClick={close}>{t("buttons.cancel")}</Button>
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
