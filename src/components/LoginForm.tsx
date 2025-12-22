import {
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function LoginForm({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        onLoginSuccess();
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <Box>
      {message === "signup_success" && (
        <Alert
          variant="filled"
          severity="success"
          sx={{
            width: "30%",
            justifyContent: "center",
            margin: "50px auto 0 auto",
          }}
        >
          Successfully signed up! Now you can log in
        </Alert>
      )}
      <form
        onSubmit={onSubmit}
        style={{ width: "300px", margin: "5rem auto 1rem auto" }}
      >
        <Stack spacing={2}>
          <Typography sx={{ textAlign: "center" }}>Please log in</Typography>
          <TextField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Sign in</Button>
        </Stack>
      </form>
    </Box>
  );
}
