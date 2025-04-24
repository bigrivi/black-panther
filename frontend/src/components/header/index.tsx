import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import {
    useGetIdentity,
    useGetLocale,
    useSetLocale,
    useTranslate,
} from "@refinedev/core";
import { useTranslation } from "react-i18next";
import {
    Layout as AntdLayout,
    Avatar,
    Button,
    Dropdown,
    MenuProps,
    Space,
    Switch,
    theme,
    Typography,
} from "antd";
import React, { useContext } from "react";
// import { ColorModeContext } from "../../contexts/color-mode";
import { DownOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { useConfigProvider } from "@/providers/config-provider";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
    id: number;
    user_name: string;
    avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
    sticky = true,
}) => {
    const { token } = useToken();
    const { data: user } = useGetIdentity<IUser>();
    const { mode, setMode } = useConfigProvider();
    const locale = useGetLocale();
    const { i18n } = useTranslation();
    const changeLanguage = useSetLocale();
    const t = useTranslate();
    const { styles } = useStyles();
    const currentLocale = locale();

    const headerStyles: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
    };

    if (sticky) {
        headerStyles.position = "sticky";
        headerStyles.top = 0;
        headerStyles.zIndex = 100;
    }

    const menuItems: MenuProps["items"] = [...(i18n.languages || [])]
        .sort()
        .map((lang: string) => ({
            key: lang,
            onClick: () => changeLanguage(lang),
            icon: (
                <span style={{ marginRight: 8 }}>
                    <Avatar size={16} src={`/images/flags/${lang}.svg`} />
                </span>
            ),
            label: lang === "en" ? "English" : "German",
        }));

    return (
        <AntdLayout.Header style={headerStyles}>
            <Space>
                <Dropdown
                    menu={{
                        items: menuItems,
                        selectedKeys: currentLocale ? [currentLocale] : [],
                    }}
                >
                    <Button onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Text className={styles.languageSwitchText}>
                                {currentLocale === "en" ? "English" : "German"}
                            </Text>
                            <DownOutlined
                                className={styles.languageSwitchIcon}
                            />
                        </Space>
                    </Button>
                </Dropdown>
                <Switch
                    checkedChildren="🌛"
                    unCheckedChildren="🔆"
                    onChange={() =>
                        setMode(mode === "light" ? "dark" : "light")
                    }
                    defaultChecked={mode === "dark"}
                />
                <Space style={{ marginLeft: "8px" }} size="middle">
                    {user?.user_name && <Text strong>{user.user_name}</Text>}
                    {user?.avatar && (
                        <Avatar src={user?.avatar} alt={user?.user_name} />
                    )}
                </Space>
            </Space>
        </AntdLayout.Header>
    );
};
