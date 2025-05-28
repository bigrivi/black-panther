import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
const LightTheme = createTheme({
    ...RefineThemes.Magenta,
    components: {
        ...RefineThemes.Magenta.components,
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
                    padding: "9px 12px",
                    "&.MuiInputBase-inputSizeSmall": {
                        padding: "6px 8px",
                    },
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
                    backgroundColor: "#f5f5f5",
                },
                body: {
                    backgroundColor: "#f5f5f5",
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                variant: "body2",
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        padding: "0px 30px 0px 8px",
                        minHeight: 43,
                        "& .MuiChip-root": {
                            height: 28,
                        },
                    },
                    "& .MuiAutocomplete-option": {
                        padding: 10,
                    },
                },
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
