import { Box, Button } from "@mui/material";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { flexColumn } from "./KanbanBoard";

interface AuthViewProps {
  showSignup: boolean;
  setShowSignup: (val: boolean) => void;
  setIsLoggedIn: (val: boolean) => void;
}

function AuthView({ showSignup, setShowSignup, setIsLoggedIn }: AuthViewProps) {
  return !showSignup ? (
    <Box sx={{ ...flexColumn, mx: "auto" }}>
      <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      <Button
        onClick={() => setShowSignup(true)}
        sx={{ textTransform: "none" }}
      >
        Don't have an account yet? Sign up here
      </Button>
    </Box>
  ) : (
    <Box sx={{ ...flexColumn, mx: "auto" }}>
      <SignupForm />
    </Box>
  );
}

export default AuthView;
