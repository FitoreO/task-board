import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppRoutes } from "./routes/AppRoutes";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useAtomValue } from "jotai";
import { modeAtom } from "./components/atoms";
import ButtonAppBar from "./components/Header";

function AppWithTheme() {
  const mode = useAtomValue(modeAtom);
  const theme = createTheme({
    palette: { mode },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <ButtonAppBar />
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
