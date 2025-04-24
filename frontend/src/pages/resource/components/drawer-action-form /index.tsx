import { SaveButton, useDrawerForm, useForm } from "@refinedev/antd";
import { BaseKey, useGetToPath, useGo } from "@refinedev/core";
import { Button, Flex, Form, Grid, Input, Select, Space, Spin } from "antd";
import { Drawer } from "@/components/drawer";
import { IAction, IResource } from "@/interfaces";
import { useSearchParams } from "react-router";
import { useStyles } from "../../styled";
import { FC } from "react";

type Props = {
    id?: BaseKey;
    open: boolean;
    action: "create" | "edit";
    onClose?: () => void;
    resourceId?: BaseKey;
    onMutationSuccess?: () => void;
};

export const ActionDrawerForm: FC<Props> = ({
    id,
    action,
    onClose,
    open,
    resourceId,
    onMutationSuccess,
}) => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const breakpoint = Grid.useBreakpoint();
    const { styles } = useStyles();
    const { drawerProps, formProps, close, saveButtonProps, formLoading } =
        useDrawerForm<IResource>({
            resource: `resource/${resourceId}/action`,
            id,
            action,
            redirect: "list",
            autoSubmitClose: true,
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
            open={open}
            title={id ? "Edit Action" : "Create Action"}
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
