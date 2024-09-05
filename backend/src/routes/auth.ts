import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/User";
import { Role } from "../model/Role";
import { authorize } from "../authorize";
import { CustomUser } from "../types/custom";
import { decryptData, encryptData } from "../utils/encryption";
import Reservation from "../model/Reservation";

const router = express.Router();
const allowedRoles = [1, 2];

// Register Route
router.post("/register", async (req: CustomUser, res: Response) => {
  const { username, password, roleId } = req.body; // Assuming roleId is provided in the request body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      roleId, // Assign the role ID
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser.id, roleId: newUser.roleId },
      "jwtSecret",
      { expiresIn: 3600 }
    );

    // Return the token
    res.json({ token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send("Server error");
    } else {
      console.error("Unknown error:", err);
      res.status(500).send("Server error");
    }
  }
});

// Login Route
router.post("/login", async (req: CustomUser, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, roleId: user.roleId }, "jwtSecret", {
      expiresIn: 3600,
    });

    // Return the token
    res.json({ token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send("Server error");
    } else {
      console.error("Unknown error:", err);
      res.status(500).send("Server error");
    }
  }
});

//Reservation Page - Customer
router.get("/reservation", authorize([1]), (req: CustomUser, res: Response) => {
  res.json({ msg: "Welcome to the dashboard", user: req.user });
});

//Dashboard - Manager
router.get(
  "/dashboard",
  authorize([2]),
  async (req: CustomUser, res: Response) => {
    try {
      const reservations = await Reservation.findAll();
      // console.log(reservations);

      //Decrypt sensitive data
      const decryptedReservations = reservations.map((reservation: any) => ({
        ...reservation.get(),
        name: decryptData(reservation.name),
        contactNumber: decryptData(reservation.contactNumber),
        paymentMethod: decryptData(reservation.paymentMethod),
      }));

      res.json({ reservations: decryptedReservations });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ msg: "Error fetching reservations" });
    }
  }
);

//Reserve room

router.post(
  "/reserve",
  authorize([1, 2]),
  async (req: CustomUser, res: Response) => {
    const { roomType, reservationDate, name, contactNumber, paymentMethod } =
      req.body;

    try {
      // Extract userId from the authenticated user
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json();
      }

      const encryptedName = encryptData(name);
      const encryptedContactNumber = encryptData(contactNumber);
      const encryptedPaymentMethod = encryptData(paymentMethod);

      const newReservation = await Reservation.create({
        roomType,
        reservationDate,
        name: encryptedName,
        contactNumber: encryptedContactNumber,
        paymentMethod: encryptedPaymentMethod,
        userId, // Attach the userId from the authenticated user
      });

      res
        .status(201)
        .json({ msg: "Reservation successful", reservation: newReservation });
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

//Show reservations for user

router.get(
  "/reservations",
  authorize([1]), // Assuming roles 1 and 2 are allowed to view reservations
  async (req: CustomUser, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
      }

      // Fetch reservations based on the logged-in user's ID
      const reservations = await Reservation.findAll({
        where: { userId },
      });

      res.json({ reservations });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ msg: "Error fetching reservations" });
    }
  }
);

export default router;
