import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { IconButton } from "@mui/material";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";

export function ToggleThemeColor({
  setMode,
  mode,
}: {
  setMode: (mode: "light" | "dark") => void;
  mode: "light" | "dark";
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "right",
        justifyContent: "right",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
        minHeight: "56px",
      }}
    >
      <FormControl>
        <Box>
          {mode === "light" && (
            <IconButton onClick={() => setMode("dark")}>
              <ModeNightIcon />
            </IconButton>
          )}

          {mode === "dark" && (
            <IconButton onClick={() => setMode("light")}>
              <LightModeIcon />
            </IconButton>
          )}
        </Box>
      </FormControl>
    </Box>
  );
}
