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
import { useAtom } from "jotai";
import ChartsModal from "./Modal";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useState } from "react";

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const handleLogout = useHandleLogout();
  const [mode, setMode] = useAtom(modeAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await handleLogout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleOpen = () => setOpen(true);

  return (
    <>
      {isLoggedIn && (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <ToggleThemeColor setMode={setMode} mode={mode} />
              <Tooltip title="Ticket statistics">
                <IconButton onClick={handleOpen}>
                  <ShowChartIcon />
                </IconButton>
              </Tooltip>
              {open && <ChartsModal open={open} setOpen={setOpen} />}
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
