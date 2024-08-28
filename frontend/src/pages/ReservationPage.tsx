import React, { useState } from "react";
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

const ReservationPage: React.FC = () => {
  const [roomType, setRoomType] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [open, setOpen] = useState(false);

  const handleReservation = () => {
    // Logic to handle the reservation, such as sending the data to the backend
  };

  const reservations = [
    { id: 1, roomType: "Single Room", date: "2024-08-20", status: "Pending" },
    { id: 2, roomType: "Suite", date: "2024-07-15", status: "Completed" },
    { id: 3, roomType: "Double Room", date: "2024-06-10", status: "Cancelled" },
  ];

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Reserve a Room
      </Typography>

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
                  secondary={`Date: ${reservation.date} - Status: ${reservation.status}`}
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
