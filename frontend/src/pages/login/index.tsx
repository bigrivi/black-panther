import * as React from "react";
import { useActiveAuthProvider, useCustom } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FormProvider } from "react-hook-form";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiLink from "@mui/material/Link";

import {
    type BaseRecord,
    type HttpError,
    useLogin,
    useTranslate,
    useRouterContext,
    useRouterType,
    useLink,
} from "@refinedev/core";
import { layoutStyles, titleStyles } from "./styles";

import { ThemedTitleV2 } from "@refinedev/mui";
import { OutlinedInput } from "@mui/material";
import { Control, Field, Help, Label } from "@/components";

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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

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
        <Card>
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
                <Box
                    component="form"
                    onSubmit={handleSubmit((data) => {
                        return login({ ...data, uuid: captchaData?.data.uuid });
                    })}
                >
                    <Field>
                        <Label htmlFor="email" required>
                            Email
                        </Label>
                        <Control>
                            <OutlinedInput
                                {...register("loginName", {
                                    required: translate(
                                        "pages.login.errors.requiredEmail",
                                        "Login name is required"
                                    ),
                                })}
                                id="email"
                                fullWidth
                            />
                        </Control>
                        <Help error={!!errors?.loginName?.message}>
                            {errors?.loginName?.message}
                        </Help>
                    </Field>
                    <Field>
                        <Label htmlFor="password" required>
                            Password
                        </Label>
                        <Control>
                            <OutlinedInput
                                {...register("password", {
                                    required: translate(
                                        "pages.login.errors.requiredPassword",
                                        "Password is required"
                                    ),
                                })}
                                id="password"
                                fullWidth
                                name="password"
                                error={!!errors.password}
                                type="password"
                                placeholder="●●●●●●●●"
                                autoComplete="current-password"
                                sx={{
                                    mb: 0,
                                }}
                            />
                        </Control>
                        <Help error={!!errors?.password?.message}>
                            {errors?.password?.message}
                        </Help>
                    </Field>

                    <Field>
                        <Label required htmlFor="codd">
                            Captcha Code
                        </Label>
                        <Control>
                            <OutlinedInput
                                {...register("captcha", {
                                    required: translate(
                                        "pages.login.errors.requiredPassword",
                                        "Password is required"
                                    ),
                                })}
                                size="small"
                                id="code"
                                error={!!errors.captcha}
                                fullWidth
                                endAdornment={
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
                                }
                            />
                        </Control>
                    </Field>
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
                                    {...register("remember")}
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
                </Box>

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
