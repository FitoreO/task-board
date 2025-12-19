import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function SignupForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const data = await res.json();

      return data;
    } catch (err) {
      console.error("Error", err);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ width: "300px", margin: "5rem auto" }}>
      <Stack spacing={2}>
        <Typography sx={{ textAlign: "center" }}>Please Sign Up</Typography>
        <TextField
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button type="submit">Sign up</Button>
      </Stack>
    </form>
  );
}
