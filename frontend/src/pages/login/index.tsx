import { Form, FormItem } from "@/components";
import { useActiveAuthProvider, useCustom } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import {
    type BaseRecord,
    type HttpError,
    useLink,
    useLogin,
    useRouterContext,
    useRouterType,
    useTranslate,
} from "@refinedev/core";
import { layoutStyles, titleStyles } from "./styles";

import { ThemedTitleV2 } from "@refinedev/mui";
import { PasswordElement, TextFieldElement } from "react-hook-form-mui";

export interface LoginFormTypes {
    loginName?: string;
    captcha?: string;
    password?: string;
    uuid?: string;
    remember?: boolean;
    redirectPath?: string;
}

export const LoginPage = () => {
    const methods = useForm<BaseRecord, HttpError, LoginFormTypes>({});
    const authProvider = useActiveAuthProvider();
    const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
        v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });
    const { data: captchaData, refetch } = useCustom({
        url: `auth/captcha`,
        method: "get",
    });
    const translate = useTranslate();
    const routerType = useRouterType();
    const Link = useLink();
    const { Link: LegacyLink } = useRouterContext();

    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

    const PageTitle = (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "32px",
                fontSize: "20px",
            }}
        >
            <ThemedTitleV2
                collapsed={false}
                wrapperStyles={{
                    gap: "8px",
                }}
            />
        </div>
    );

    const Content = (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent
                sx={{
                    p: "32px",
                    "&:last-child": { pb: "32px" },
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    align="center"
                    style={titleStyles}
                    color="primary"
                    fontWeight={700}
                >
                    {translate("pages.login.title", "Sign in to your account")}
                </Typography>
                <Form
                    formContext={methods}
                    onSuccess={(data) => {
                        return login({ ...data, uuid: captchaData?.data.uuid });
                    }}
                >
                    <FormItem
                        label={translate("pages.login.fields.loginName")}
                        required
                        htmlFor="loginName"
                    >
                        <TextFieldElement
                            name="loginName"
                            id="loginName"
                            rules={{
                                required: translate(
                                    "pages.login.errors.requiredEmail",
                                    "Login name is required"
                                ),
                            }}
                        />
                    </FormItem>
                    <FormItem
                        label={translate("pages.login.fields.password")}
                        required
                        htmlFor="password"
                    >
                        <PasswordElement
                            name="password"
                            id="password"
                            rules={{
                                required: translate(
                                    "pages.login.errors.requiredPassword",
                                    "Password is required"
                                ),
                            }}
                        />
                    </FormItem>
                    <FormItem
                        label={translate("pages.login.fields.captchaCode")}
                        required
                        htmlFor="captcha"
                    >
                        <TextFieldElement
                            name="captcha"
                            id="captcha"
                            rules={{
                                required: "Captcha code is required",
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <Button
                                            variant="text"
                                            style={{ padding: 0 }}
                                            size="small"
                                            onClick={() => refetch()}
                                        >
                                            {captchaData && (
                                                <img
                                                    style={{
                                                        width: 120,
                                                        height: "100%",
                                                        borderRadius: 8,
                                                    }}
                                                    src={
                                                        "data:image/png;base64," +
                                                        captchaData?.data.image
                                                    }
                                                    alt=""
                                                />
                                            )}
                                        </Button>
                                    ),
                                },
                            }}
                        />
                    </FormItem>
                    <Box
                        component="div"
                        sx={{
                            mt: "24px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <FormControlLabel
                            sx={{
                                span: {
                                    fontSize: "14px",
                                    color: "text.secondary",
                                },
                            }}
                            color="secondary"
                            control={
                                <Checkbox
                                    size="small"
                                    id="remember"
                                    {...methods.register("remember")}
                                />
                            }
                            label={translate(
                                "pages.login.buttons.rememberMe",
                                "Remember me"
                            )}
                        />

                        <MuiLink
                            variant="body2"
                            color="primary"
                            fontSize="12px"
                            component={ActiveLink}
                            underline="none"
                            to="/forgot-password"
                        >
                            {translate(
                                "pages.login.buttons.forgotPassword",
                                "Forgot password?"
                            )}
                        </MuiLink>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{ mt: "24px" }}
                    >
                        {translate("pages.login.signin", "Sign in")}
                    </Button>
                </Form>

                <Box
                    sx={{
                        mt: "24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        textAlign="center"
                        variant="body2"
                        component="span"
                        fontSize="12px"
                    >
                        {translate(
                            "pages.login.buttons.noAccount",
                            "Don’t have an account?"
                        )}
                    </Typography>
                    <MuiLink
                        ml="4px"
                        fontSize="12px"
                        variant="body2"
                        color="primary"
                        component={ActiveLink}
                        underline="none"
                        to="/register"
                        fontWeight="bold"
                    >
                        {translate("pages.login.signup", "Sign up")}
                    </MuiLink>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <FormProvider {...methods}>
            <Box component="div" style={layoutStyles}>
                <Container
                    component="main"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100dvh",
                        padding: "16px",
                        width: "100%",
                        maxWidth: "450px",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "450px",
                            display: "flex",
                            flexDirection: "column",
                            paddingTop: 0,
                        }}
                    >
                        <>
                            {PageTitle}
                            {Content}
                        </>
                    </Box>
                </Container>
            </Box>
        </FormProvider>
    );
};
