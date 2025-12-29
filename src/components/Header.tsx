import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { useHandleLogout } from "./hooks/handleLogout";
import { useNavigate } from "react-router-dom";
import { flexEnd } from "../styles/flex";
import { Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ToggleThemeColor } from "./ToggleThemeColor";
import { isLoggedInAtom, modeAtom } from "./atoms";
import { useAtom, useAtomValue } from "jotai";

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const handleLogout = useHandleLogout();
  const [mode, setMode] = useAtom(modeAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  const logout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <>
      {isLoggedIn && (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <ToggleThemeColor setMode={setMode} mode={mode} />
              <Box sx={{ ...flexEnd }}>
                <Tooltip title="Log out">
                  <IconButton onClick={logout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </>
  );
}
