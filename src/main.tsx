import { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppRoutes } from "./routes/AppRoutes";
import { createTheme, ThemeProvider } from "@mui/material";
import { ToggleThemeColor } from "./components/ToggleThemeColor";

function AppWithTheme() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = createTheme({
    palette: { mode },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <ToggleThemeColor setMode={setMode} mode={mode} />
          <AppRoutes />
        </DndProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(<AppWithTheme />);
