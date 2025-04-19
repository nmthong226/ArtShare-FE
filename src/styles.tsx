import { createTheme } from "@mui/material/styles";

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      // Use Indigo 500 (#5c6bc0) as the main primary color
      main: "#5c6bc0",
      // Add Indigo 400 (#7986cb) as the light variant
      light: "#7986cb",
      // Add Indigo 600 (#3f51b5) as the dark variant (useful for hovers)
      dark: "#3f51b5",
    },
    secondary: {
      main: "#6b7280", // Grey 
    },
    background: {
      default: "#f3f4f6", // Light grey background
      paper: "#ffffff", // White content surfaces
    },
    text: {
      primary: "#111827", // Almost black
      secondary: "#6b7280", // Grey
    },
    divider: "#d1d5db", // Soft grey for borders
    error: {
      main: "#d32f2f", // Standard MUI red
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none", 
          fontWeight: 500, // Default font weight
        },
        text: {
          "&.MuiButton-root": {
            color: "#000000", // black text
            fontWeight: 700, // bold
          },
          // Add a subtle hover if desired for text variant
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)", // Standard subtle background on hover
          },
        },
        contained: {
          backgroundColor: "#7986cb", // Indigo 400
          color: "#ffffff", 
          "&:hover": {
            backgroundColor: "#5c6bc0", // Darken slightly on hover (Indigo 500)
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(159, 168, 218, 0.5)",
            color: "rgba(255, 255, 255, 0.7)",
          }
        },
        outlined: {
          borderColor: "#5c6bc0", // Indigo 500 for the border
          color: "#5c6bc0", // Indigo 500 for the text
          "&:hover": {
            borderColor: "#3f51b5", // Darken border on hover (Indigo 600)
            backgroundColor: "rgba(121, 134, 203, 0.04)", // Add a very faint background tint on hover (Indigo 500 with low alpha)
          },
          "&.Mui-disabled": {
            borderColor: "rgba(121, 134, 203, 0.5)",
            color: "rgba(121, 134, 203, 0.5)",
          }
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#6b7280", // grey when unchecked
          "&.Mui-checked": {
            color: "#a5b4fc", // Indigo when checked
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: "#111827",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#e5e7eb", // Light gray chip
          color: "#111827",
          fontWeight: 500,
        },
        deleteIcon: {
          color: "#6b7280",
          "&:hover": {
            color: "#374151",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#d1d5db",
            },
            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#a5b4fc", // Indigo when focused
            },
          },
          "& .MuiInputBase-input": {
            padding: "10px",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
        input: {
          color: "#111827",
          padding: "10px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f3f4f6",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#6b7280",
          "&.Mui-checked": {
            color: "#a5b4fc",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: "#a5b4fc",
          "&.Mui-checked": {
            color: "#a5b4fc",
          },
          "&.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#a5b4fc",
          },
        },
        track: {
          backgroundColor: "#d1d5db", // Light grey when off
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#a5b4fc",
        },
        thumb: {
          "&:hover, &.Mui-focusVisible, &.Mui-active": {
            boxShadow: "0px 0px 0px 8px rgba(165, 180, 252, 0.16)",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        barColorPrimary: {
          backgroundColor: "#a5b4fc",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        circle: {
          stroke: "#a5b4fc",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#111827", // Default dark gray for light mode
        },
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
        subtitle1: { color: "#374151" }, // Slightly lighter than primary text
        subtitle2: { color: "#6b7280" }, // Even lighter
        body1: { color: "#374151" },
        body2: { color: "#6b7280" },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#000",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: "#22c55e", // Tailwind green-500
          color: "#ffffff",
        },
        standardError: {
          backgroundColor: "#ef4444", // Tailwind red-500
          color: "#ffffff",
        },
        standardInfo: {
          backgroundColor: "#3b82f6", // Tailwind blue-500
          color: "#ffffff",
        },
        standardWarning: {
          backgroundColor: "#f59e0b", // Tailwind amber-500
          color: "#ffffff",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a5b4fc",
    },
    secondary: {
      main: "#8F8F8F",
    },
    mountain: {
      100: "#e7e7e7",
      400: "#9ca3af",
    },
    background: {
      default: "#121212", // Dark background color
      paper: "#262626", // Darker paper color
    },
    text: {
      primary: "#ffffff", // White text for dark mode
      secondary: "#9ca3af", // Lighter text color for secondary elements
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#818cf8",
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#a5b4fc",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#262626",
            "& fieldset": {
              borderColor: "#9ca3af", // mountain-400
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "#e7e7e7", // mountain-100
              borderWidth: "2px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#e7e7e7", // primary.main on focus
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input": {
            padding: "10px",
            color: "#ffffff",
          },
          "& .MuiInputBase-inputMultiline": {
            padding: "0px",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#262626",
        },
        input: {
          color: "#ffffff",
          padding: "10px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#262626",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#262626",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#262626",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#262626",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: "#22c55e",
          color: "#ffffff",
        },
        standardError: {
          backgroundColor: "#ef4444",
          color: "#ffffff",
        },
        standardInfo: {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
        },
        standardWarning: {
          backgroundColor: "#f59e0b",
          color: "#ffffff",
        },
      },
    },
  },
});
