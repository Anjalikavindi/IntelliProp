import express from "express";
import { sendOTP, verifyOTP } from "../../controllers/website/otpController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protected route: user must be logged in
router.post("/send", verifyToken, sendOTP);
router.post("/verify", verifyToken, verifyOTP);

export default router;
