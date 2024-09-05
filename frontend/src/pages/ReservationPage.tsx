import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import LogoutButton from "../components/Logout";

const ReservationPage: React.FC = () => {
  const [roomType, setRoomType] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [open, setOpen] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const handleReservation = async () => {
    const reservationData = {
      roomType: roomType,
      reservationDate: date,
      name,
      contactNumber: contact,
      paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(reservationData),
      });
      console.log(reservationData);

      const data = await response.json();

      if (response.ok) {
        alert("Reservation successful!");
        // Optionally, fetch reservations again
        // fetchReservations();
      } else {
        setError(data.msg || "Error making reservation");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error making reservation");
    }
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/reservations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("token") || "",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setReservations(data.reservations || []);
        } else {
          setError(data.msg || "Error fetching reservations");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error fetching reservations");
      }
    };

    fetchReservations();
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Reserve a Room
      </Typography>
      <LogoutButton />
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Room Type"
          variant="outlined"
          select
          fullWidth
          margin="normal"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        >
          <MenuItem value="Single">Single Room</MenuItem>
          <MenuItem value="Double">Double Room</MenuItem>
          <MenuItem value="Suite">Suite</MenuItem>
        </TextField>

        <TextField
          label="Reservation Date"
          variant="outlined"
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Contact Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        <FormControl component="fieldset" margin="normal" fullWidth>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          <RadioGroup
            row
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
            <FormControlLabel value="Card" control={<Radio />} label="Card" />
          </RadioGroup>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleReservation}
          sx={{ mt: 2 }}
        >
          Reserve
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>

      <Box
        sx={{
          paddingTop: "20px",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleToggle}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          {open ? "Hide" : "Show"} Reservation History
        </Button>
        <Collapse in={open}>
          <List>
            {reservations.map((reservation) => (
              <ListItem key={reservation.id}>
                <ListItemText
                  primary={`${reservation.roomType}`}
                  secondary={`Date: ${reservation.date}`}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>
    </Container>
  );
};

export default ReservationPage;
