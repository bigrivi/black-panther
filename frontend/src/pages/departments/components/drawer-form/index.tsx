import { Form, FormItem } from "@/components";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/drawer";
import { TreeSelectFieldElement } from "@/components/form/elements";
import { useQuery } from "@/hooks/useQuery";
import { IDepartment, Nullable } from "@/interfaces";
import { Button, Stack } from "@mui/material";
import {
    BaseKey,
    HttpError,
    useCustom,
    useGetToPath,
    useGo,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FC, useMemo } from "react";
import { TextFieldElement } from "react-hook-form-mui";
import { useSearchParams } from "react-router";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
};

export const DeptDrawerForm: FC<Props> = ({ action }) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const query = useQuery();

    const {
        refineCore: { onFinish, id },
        saveButtonProps,
        ...methods
    } = useForm<IDepartment, HttpError, Nullable<IDepartment>>({
        defaultValues: {
            name: "",
            parent_id: query.get("parent_id")
                ? Number(query.get("parent_id"))
                : null,
        },
        refineCoreProps: {
            action,
            redirect: "list",
            onMutationSuccess: () => {
                onDrawerCLose();
            },
        },
    });

    const { data: deptTreeData } = useCustom<IDepartment[]>({
        url: `dept/tree`,
        method: "get",
        config: {
            query: {
                exclude_id: id,
            },
        },
    });

    const treeData = useMemo(() => {
        return [
            {
                id: null,
                name: "Root",
                children: [...(deptTreeData?.data ?? [])],
            },
        ];
    }, [deptTreeData]);

    const onDrawerCLose = () => {
        go({
            to:
                searchParams.get("to") ??
                getToPath({
                    action: "list",
                }) ??
                "",
            query: {
                to: undefined,
            },
            options: {
                keepQuery: true,
            },
            type: "replace",
        });
    };

    return (
        <Drawer
            slotProps={{
                paper: { sx: { width: { sm: "100%", md: "616px" } } },
            }}
            open={true}
            title={id ? "Edit Department" : "Create Department"}
            anchor="right"
            onClose={onDrawerCLose}
        >
            <DrawerContent>
                <Form
                    formContext={methods}
                    onSuccess={(data) => {
                        onFinish(data);
                    }}
                >
                    <FormItem label="Department Name" required htmlFor="name">
                        <TextFieldElement name="name" id="name" />
                    </FormItem>
                    <FormItem label="Parent" htmlFor="parent_id">
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
                    <Button onClick={onDrawerCLose}>Cancel</Button>
                    <Button
                        {...saveButtonProps}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Save
                    </Button>
                </Stack>
            </DrawerFooter>
        </Drawer>
    );
};
