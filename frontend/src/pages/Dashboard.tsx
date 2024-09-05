import React, { useState, useEffect } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Reservation {
  id: string;
  roomType: string;
  date: string;
  status: "Pending" | "Accepted" | "Rejected";
}

const Dashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Check if token exists
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch reservations from backend using fetch
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/auth/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }

        const data = await response.json();
        setReservations(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reservations");
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token, navigate]);

  const handleAccept = async (id: string) => {
    // try {
    //   // Send a request to update the reservation status to "Accepted"
    //   const response = await fetch(`/api/reservations/${id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-auth-token": token || "",
    //     },
    //     body: JSON.stringify({ status: "Accepted" }),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to update reservation");
    //   }
    //   setReservations((prev) =>
    //     prev.map((reservation) =>
    //       reservation.id === id
    //         ? { ...reservation, status: "Accepted" }
    //         : reservation
    //     )
    //   );
    // } catch (err) {
    //   setError("Failed to update reservation");
    // }
  };

  const handleReject = async (id: string) => {
    // try {
    //   // Send a request to update the reservation status to "Rejected"
    //   const response = await fetch(`/api/reservations/${id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-auth-token": token || "",
    //     },
    //     body: JSON.stringify({ status: "Rejected" }),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to update reservation");
    //   }
    //   setReservations((prev) =>
    //     prev.map((reservation) =>
    //       reservation.id === id
    //         ? { ...reservation, status: "Rejected" }
    //         : reservation
    //     )
    //   );
    // } catch (err) {
    //   setError("Failed to update reservation");
    // }
  };

  if (loading) {
    return <Typography>Loading reservations...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Manage Reservations
      </Typography>
      <List>
        {reservations.map((reservation) => (
          <ListItem key={reservation.id} divider>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ListItemText
                  primary={`${reservation.roomType}`}
                  secondary={`Date: ${reservation.date}`}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" color="textSecondary">
                  Status: {reservation.status}
                </Typography>
              </Grid>
              <Grid item xs={3} container spacing={1}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={reservation.status !== "Pending"}
                    onClick={() => handleAccept(reservation.id)}
                  >
                    Accept
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={reservation.status !== "Pending"}
                    onClick={() => handleReject(reservation.id)}
                  >
                    Reject
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Dashboard;
