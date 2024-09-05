import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/User";
import { Role } from "../model/Role";
import { authorize } from "../authorize";
import { CustomUser } from "../types/custom";
import { decryptData, encryptData } from "../utils/encryption";
import Reservation from "../model/Reservation";
import { generateOTP } from "../utils/otp";
import { sendOTPEmail } from "../services/emailService";

const router = express.Router();
const allowedRoles = [1, 2];

// Register Route
router.post("/register", async (req: CustomUser, res: Response) => {
  const { email, password, roleId } = req.body; // Assuming roleId is provided in the request body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      email,
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
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Send OTP to the user's email
    await sendOTPEmail(user.email, otp);

    // Save OTP and its expiration time to the user model
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
    await user.save();

    // Return success message
    res.json({
      msg: "OTP sent to your email. Please verify the OTP.",
      userId: user.id,
    });
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

router.post("/verify-otp", async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) return res.status(400).json({ msg: "Invalid user" });

    // Check if OTP exists and if otpExpiresAt is not null
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ msg: "OTP not found or expired" });
    }

    // Check if the OTP matches and is still valid
    const now = new Date();
    if (user.otp !== otp || now > user.otpExpiresAt) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // OTP is valid, generate the JWT token
    const token = jwt.sign({ id: user.id, roleId: user.roleId }, "jwtSecret", {
      expiresIn: 3600, // 1 hour
    });

    // Clear OTP fields from the user record (no longer needed)
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Return the JWT token
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
