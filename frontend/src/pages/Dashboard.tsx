import React, { useState } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Grid,
} from "@mui/material";

interface Reservation {
  id: string;
  roomType: string;
  date: string;
  status: "Pending" | "Accepted" | "Rejected";
}

const initialReservations: Reservation[] = [
  { id: "1", roomType: "Single Room", date: "2024-08-20", status: "Pending" },
  { id: "2", roomType: "Suite", date: "2024-08-18", status: "Accepted" },
  { id: "3", roomType: "Double Room", date: "2024-08-16", status: "Pending" },
];

const Dashboard: React.FC = () => {
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);

  const handleAccept = (id: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "Accepted" }
          : reservation
      )
    );
  };

  const handleReject = (id: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "Rejected" }
          : reservation
      )
    );
  };

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
