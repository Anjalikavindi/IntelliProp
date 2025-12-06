import nodemailer from "nodemailer";
import db from "../../config/db.js";

// For simplicity, store OTPs in memory (for production, use DB or cache)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const sendOTP = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOTP();
  otpStore.set(email, otp);

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // or another service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to send OTP" });
    } else {
      console.log(`OTP sent: ${otp} to ${email}`);
      return res.json({ message: "OTP sent successfully" });
    }
  });
};

// Verify OTP
export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOTP = otpStore.get(email);
  if (!storedOTP) {
    return res.status(400).json({ message: "No OTP found or expired" });
  }

  if (parseInt(otp) !== storedOTP) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP verified, remove from store
  otpStore.delete(email);

  // Update user's email verification status
  const updateQuery = "UPDATE users SET is_email_verified = 1 WHERE email = ?";
  db.query(updateQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Failed to update verification status" });
    }

    return res.json({ message: "OTP verified successfully, email is now verified" });
  });
  
};
