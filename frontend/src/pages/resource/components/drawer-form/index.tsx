import { SaveButton, useDrawerForm, useForm } from "@refinedev/antd";
import { BaseKey, useGetToPath, useGo } from "@refinedev/core";
import { Button, Flex, Form, Grid, Input, Select, Space, Spin } from "antd";
import { Drawer } from "@/components/drawer";
import { IAction, IResource } from "@/interfaces";
import { useSearchParams } from "react-router";
import { useStyles } from "./styled";
import { FC } from "react";

type Props = {
    id?: BaseKey;
    action: "create" | "edit";
    onClose?: () => void;
    onMutationSuccess?: () => void;
};

export const ResourceDrawerForm: FC<Props> = ({
    id,
    action,
    onClose,
    onMutationSuccess,
}) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const breakpoint = Grid.useBreakpoint();
    const { styles } = useStyles();
    const { drawerProps, formProps, close, saveButtonProps, formLoading } =
        useDrawerForm<IResource>({
            resource: "resource",
            id,
            action,
            redirect: "list",
            autoSubmitClose: true,
            queryOptions: {
                select: (data) => {
                    const actions = data.data.actions?.map(
                        (ele) => (ele as IAction).name
                    );
                    return {
                        data: {
                            ...data.data,
                            actions,
                        },
                    };
                },
            },
            onMutationSuccess: () => {
                onMutationSuccess?.();
            },
        });

    const onDrawerCLose = () => {
        if (onClose) {
            onClose();
            return;
        }
        close();
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
            {...drawerProps}
            open={true}
            title={"Create Resource"}
            width={breakpoint.sm ? "578px" : "100%"}
            zIndex={1001}
            onClose={onDrawerCLose}
        >
            <Spin spinning={formLoading}>
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        className={styles.formItem}
                        label={"Name"}
                        name={["name"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        className={styles.formItem}
                        label={"Key"}
                        name={["key"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        className={styles.formItem}
                        label={"Actions"}
                        initialValue={[
                            "list",
                            "create",
                            "edit",
                            "show",
                            "delete",
                        ]}
                        name={["actions"]}
                        help="Actions are the ways a user can act on a resource, or access the resource. After typing the action name into the box, press <Enter> or <Return> on your keyboard for the action to be correctly added."
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            mode="tags"
                            style={{ width: "100%" }}
                            placeholder="Add action"
                            options={[
                                { value: "list", label: "list" },
                                { value: "create", label: "create" },
                                { value: "edit", label: "edit" },
                                { value: "show", label: "show" },
                                { value: "delete", label: "delete" },
                            ]}
                        />
                    </Form.Item>

                    <Flex justify="flex-end">
                        <Space
                            align="end"
                            style={{
                                padding: "16px 16px 0px 16px",
                            }}
                        >
                            <Button type="text" onClick={onDrawerCLose}>
                                Cancel
                            </Button>
                            <SaveButton
                                {...saveButtonProps}
                                htmlType="submit"
                                type="primary"
                                icon={null}
                            >
                                Save
                            </SaveButton>
                        </Space>
                    </Flex>
                </Form>
            </Spin>
        </Drawer>
    );
};
