import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ReservationPage from "./pages/ReservationPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  let role = null;

  if (isAuthenticated) {
    // Decode the JWT token to get the role
    const decoded: any = jwtDecode(token);
    role = decoded.roleId;
  }
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/reservation"
          element={
            isAuthenticated && role === 1 ? (
              <ReservationPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated && role === 2 ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
