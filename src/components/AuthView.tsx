import { Box, Button } from "@mui/material";
import LoginForm from "./LoginForm";
import { flexColumn } from "../styles/flex";
import { useNavigate } from "react-router-dom";

function AuthView({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ ...flexColumn, mx: "auto" }}>
      <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
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
