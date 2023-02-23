const palette = {
  primary: {
    lighter: "#d1e8f5",
    light: "#75bae2",
    main: "#198cce",
    dark: "#0f547c",
    darker: "#051c29",
  },

  background: {
    // default: "#27292d",
    // paper: "#1f2024",
  },
  typography: {
    primary: "#fff",
    secondary: "#fff",
  },
};

export const themeConfig = {
  palette,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "1rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "'Roboto', sans-serif",
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: palette.primary.dark,
            },
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
        },
      },
    },
  },

  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
};
