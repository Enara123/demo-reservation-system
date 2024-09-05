import React, { useState } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<"login" | "otp">("login");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response JSON:", data);

      if (response.ok) {
        setUserId(data.userId); // Store user ID for OTP verification
        setStep("otp"); // Move to OTP verification step
      } else {
        setError(data.msg);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Login failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, otp }),
        }
      );

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
      console.error("Error verifying OTP:", error);
      setError("OTP verification failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        {step === "login" ? "Login" : "Enter OTP"}
      </Typography>

      {step === "login" ? (
        <>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        </>
      ) : (
        <>
          <TextField
            label="OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </Button>
        </>
      )}

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default LoginPage;
