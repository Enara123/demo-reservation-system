import React from "react";
import { Button } from "@mui/material";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");

    // Redirect user to the login page or homepage
    window.location.href = "/login";
  };

  return (
    <Button variant="outlined" color="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
