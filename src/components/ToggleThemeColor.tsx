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
        justifyContent: "flex-end",
        color: "text.primary",
        borderRadius: 1,
        minHeight: "46px",
        width: "100%",
        marginTop: "5px",
      }}
    >
      <FormControl>
        <IconButton
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "light" ? <ModeNightIcon /> : <LightModeIcon />}
        </IconButton>
      </FormControl>
    </Box>
  );
}
