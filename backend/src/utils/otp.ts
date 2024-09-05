import speakeasy from "speakeasy";

// Function to generate OTP (One-Time Password)
export const generateOTP = () => {
  return speakeasy.totp({
    secret: process.env.SECRET_2FA || "Your2FASecretHere", // Add this in your environment variables
    encoding: "base32",
    digits: 6, // 6-digit OTP
    step: 300, // OTP expires in 5 minutes
  });
};
