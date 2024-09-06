import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lostruppelll@gmail.com",
    pass: "dter lphc hnrp tklo",
  },
});

// Function to send OTP email
export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: "lostruppelll@gmail.com",
    to: email,
    subject: "Your 2FA OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
