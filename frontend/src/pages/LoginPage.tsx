import React, { useState } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response Status:", response.status);
      console.log("Response Body:", await response.clone().text()); // Clone response to read body multiple times

      const data = await response.json();
      console.log("Response JSON:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded: any = jwtDecode(data.token);
        console.log("Decoded JWT:", decoded);
        if (decoded.roleId === 1) {
          window.location.href = "/reservation";
        } else if (decoded.roleId === 2) {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data.msg);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  );
};

export default LoginPage;
