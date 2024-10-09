import React from "react";
import { createRoot } from "react-dom/client";
import HostApp from "./components/HostApp";
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { measureAllMetrics } from "./measureAllMetrics";
import typography from "./aussie/typography";

const theme = createTheme({
  primaryColor: "purple",
  colors: {
    purple: [
      "#1a0d23",
      "#331745",
      "#4b1f68",
      "#633482",
      "#7d4e9c",
      "#996db7",
      "#b791d1",
      "#d8bbeb",
      "#e9d5f7",
      "#f3e6fc",
      "#faf3fe",
    ],
    yellow: [
      "#1a0d23",
      "#331745",
      "#4b1f68",
      "#633482",
      "#7d4e9c",
      "#996db7",
      "#b791d1",
      "#d8bbeb",
      "#e9d5f7",
      "#f3e6fc",
      "#faf3fe",
    ],
  },
  fontFamily: typography.body1.fontFamily,
  headings: {
    fontFamily: typography.display.fontFamily,
  },
  shadows: {
    md: "0 4px 8px rgba(0, 0, 0, 0.1)",
    xl: "0 8px 16px rgba(0, 0, 0, 0.15)",
  },
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        color: "purple",
      },
      styles: (theme: any) => ({
        root: {
          backgroundColor: theme.colors.purple[2],
          color: theme.white,
          "&:hover": {
            backgroundColor: theme.colors.purple[7],
          },
        },
      }),
    },
  },
});
const root = createRoot(document.getElementById("root")!);
root.render(
  <MantineProvider theme={theme}>
    <Router>
      <HostApp />
    </Router>
  </MantineProvider>
);

measureAllMetrics();
