import { Tag, Typography, theme } from "antd";
import { CheckCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";

type Props = {
    value: boolean;
};

export const Status = ({ value }: Props) => {
    const t = useTranslate();
    const { token } = theme.useToken();

    return (
        <Tag
            color={value ? "green" : "default"}
            style={{
                color: value ? token.colorSuccess : token.colorError,
            }}
            icon={value ? <CheckCircleOutlined /> : <PauseCircleOutlined />}
        >
            <Typography.Text>{t(`fields.status.${value}`)}</Typography.Text>
        </Tag>
    );
};
