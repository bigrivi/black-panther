import React, { useRef, useState } from "react";
import {
  type LoginPageProps,
  useLink,
  useRouterType,
  useActiveAuthProvider,
  useApiUrl,
  useCustom,
} from "@refinedev/core";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  type CardProps,
  type LayoutProps,
  Divider,
  type FormProps,
  theme,
} from "antd";
import { useLogin, useTranslate, useRouterContext } from "@refinedev/core";

import {
  bodyStyles,
  containerStyles,
  headStyles,
  layoutStyles,
  titleStyles,
} from "./styles";
import { ThemedTitleV2 } from "@refinedev/antd";
import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCountDown } from "ahooks";
import { formatCountdown } from "../../utils/formatCountdown";

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;

export interface LoginFormTypes {
  loginName?: string;
  captcha?: string;
  password?: string;
  uuid?: string;
  remember?: boolean;
  providerName?: string;
  redirectPath?: string;
}

export const Login: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
  mutationVariables,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const [isLocked, setIsLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState<number>();
  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;
  const authProvider = useActiveAuthProvider();
  const API_URL = useApiUrl();
  const [countdown] = useCountDown({
    targetDate: unlockTime,
    onEnd: () => {
      setIsLocked(false);
    },
  });
  const { data: captchaData, refetch } = useCustom({
    url: `${API_URL}/auth/captcha`,
    method: "get",
  });
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitleV2 collapsed={false} />}
      </div>
    );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {translate("pages.login.title", "Sign in to your account")}
    </Typography.Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
                onClick={() => {
                  login({
                    ...mutationVariables,
                    providerName: provider.name,
                  });
                }}
              >
                {provider.label}
              </Button>
            );
          })}
          {!hideForm && (
            <Divider>
              <Typography.Text
                style={{
                  color: token.colorTextLabel,
                }}
              >
                {translate("pages.login.divider", "or")}
              </Typography.Text>
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      title={CardTitle}
      styles={{
        header: headStyles,
        body: bodyStyles,
      }}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
      {...(contentProps ?? {})}
    >
      {renderProviders()}
      {!hideForm && (
        <Form<LoginFormTypes>
          layout="vertical"
          form={form}
          onFinish={(values) =>
            login(
              {
                ...values,
                uuid: captchaData?.data.uuid,
                ...mutationVariables,
              },
              {
                onSuccess: (data: any) => {
                  console.log(data);
                  // handle success
                  if (!data.success) {
                    refetch();
                    if (data.unlockDate) {
                      setIsLocked(true);
                      setUnlockTime(new Date(data.unlockDate).getTime());
                    }
                  }
                },
                onError: (error) => {
                  console.log(error);
                  refetch();
                },
              }
            )
          }
          requiredMark={false}
          initialValues={{
            remember: false,
          }}
          {...formProps}
        >
          <Form.Item
            name="loginName"
            label={translate("pages.login.fields.loginName", "Login Name")}
            rules={[
              {
                required: true,
                message: translate(
                  "pages.login.errors.requiredEmail",
                  "Login name is required"
                ),
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder={translate(
                "pages.login.fields.loginName",
                "Login name"
              )}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={translate("pages.login.fields.password", "Password")}
            rules={[
              {
                required: true,
                message: translate(
                  "pages.login.errors.requiredPassword",
                  "Password is required"
                ),
              },
            ]}
          >
            <Input
              type="password"
              prefix={<LockOutlined />}
              placeholder="●●●●●●●●"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="captcha"
            style={{ marginBottom: "12px" }}
            rules={[
              {
                required: true,
                message: "验证码不可为空",
              },
            ]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Input
                style={{
                  flex: 1,
                  transition: "width .3s",
                  marginRight: 8,
                }}
                prefix={<SafetyCertificateOutlined />}
                placeholder={"请输入验证码"}
                size="large"
              />
              <Button
                size="large"
                onClick={() => refetch()}
                style={{
                  display: "block",
                  width: 120,
                  padding: "0px 4px",
                }}
              >
                {captchaData && (
                  <img
                    style={{
                      width: 120,
                      height: "100%",
                      borderRadius: 8,
                    }}
                    src={"data:image/png;base64," + captchaData?.data.image}
                    alt=""
                  />
                )}
              </Button>
            </div>
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            {rememberMe ?? (
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox
                  style={{
                    fontSize: "12px",
                  }}
                >
                  {translate("pages.login.buttons.rememberMe", "Remember me")}
                </Checkbox>
              </Form.Item>
            )}
            {forgotPasswordLink ?? (
              <ActiveLink
                style={{
                  color: token.colorPrimaryTextHover,
                  fontSize: "12px",
                  marginLeft: "auto",
                }}
                to="/forgot-password"
              >
                {translate(
                  "pages.login.buttons.forgotPassword",
                  "Forgot password?"
                )}
              </ActiveLink>
            )}
          </div>
          {!hideForm && (
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                disabled={isLocked}
                loading={isLoading}
                block
              >
                {!isLocked && (
                  <span>{translate("pages.login.signin", "Sign in")}</span>
                )}
                {isLocked && countdown && (
                  <span>
                    {translate("pages.login.signinLock", {
                      countdown: formatCountdown(countdown),
                    })}
                  </span>
                )}
              </Button>
            </Form.Item>
          )}
        </Form>
      )}

      {registerLink ?? (
        <div
          style={{
            marginTop: hideForm ? 16 : 8,
          }}
        >
          <Typography.Text style={{ fontSize: 12 }}>
            {translate(
              "pages.login.buttons.noAccount",
              "Don’t have an account?"
            )}{" "}
            <ActiveLink
              to="/register"
              style={{
                fontWeight: "bold",
                color: token.colorPrimaryTextHover,
              }}
            >
              {translate("pages.login.signup", "Sign up")}
            </ActiveLink>
          </Typography.Text>
        </div>
      )}
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align={hideForm ? "top" : "middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: hideForm ? "15dvh" : "16px",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};
