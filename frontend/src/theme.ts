import gray from "@mui/material/colors/grey";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";

const LightTheme = createTheme({
    ...RefineThemes.Purple,
    components: {
        ...RefineThemes.PurpleDark.components,
        MuiChip: {
            styleOverrides: {
                labelSmall: {
                    lineHeight: "18px",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    padding: "10px 12px",
                },
                root: {
                    borderRadius: "6px",
                    "&.MuiInputBase-multiline": {
                        padding: 0,
                        textarea: {
                            minHeight: 70,
                        },
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "main.MuiBox-root": {
                    backgroundColor: gray[100],
                },
                body: {
                    backgroundColor: gray[100],
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                variant: "body2",
            },
        },
    },
});

const DarkTheme = createTheme({
    ...RefineThemes.OrangeDark,
    components: {
        ...RefineThemes.OrangeDark.components,
        MuiChip: {
            styleOverrides: {
                labelSmall: {
                    lineHeight: "18px",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "main.MuiBox-root": {
                    backgroundColor: "#121212",
                },
                body: {
                    backgroundColor: "#121212",
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                variant: "body2",
            },
        },
    },
});

const DarkThemeWithResponsiveFontSizes = responsiveFontSizes(DarkTheme);
const LightThemeWithResponsiveFontSizes = responsiveFontSizes(LightTheme);

export { DarkThemeWithResponsiveFontSizes, LightThemeWithResponsiveFontSizes };
