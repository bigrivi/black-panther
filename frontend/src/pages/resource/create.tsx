import { Create, SaveButton, useDrawerForm, useForm } from "@refinedev/antd";
import { useGetToPath, useGo, useList } from "@refinedev/core";
import { Button, Flex, Form, Grid, Input, Space, Spin } from "antd";
import { Drawer } from "@/components/drawer";
import { IResource } from "@/interfaces";
import { useSearchParams } from "react-router";
import { useStyles } from "./styled";

export const ResourceCreate = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const breakpoint = Grid.useBreakpoint();
    const { styles } = useStyles();
    const { drawerProps, formProps, close, saveButtonProps, formLoading } =
        useDrawerForm<IResource>({
            resource: "resource",
            action: "create",
            redirect: "list",
            autoSubmitClose: true,
        });

    const onDrawerCLose = () => {
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
