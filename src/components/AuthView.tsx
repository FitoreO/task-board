import { Box, Button } from "@mui/material";
import LoginForm from "./LoginForm";
import { flexColumn } from "../styles/flex";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { isLoggedInAtom } from "./atoms";

function AuthView() {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);

  return (
    <Box
      sx={{
        ...flexColumn,
        mx: "auto",
        height: 535,
      }}
    >
      <LoginForm
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          navigate("/kanban");
        }}
      />
      <Button
        onClick={() => navigate("/signup")}
        sx={{ textTransform: "none" }}
      >
        Don't have an account yet? Sign up here
      </Button>
    </Box>
  );
}

export default AuthView;
