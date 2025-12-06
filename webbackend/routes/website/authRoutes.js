import express from "express";
import { registerUser, loginUser, getLoggedUser, updateProfile } from "../../controllers/website/authController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Register Route
router.post("/register", registerUser);
// Login Route
router.post("/login", loginUser);
// to get logged-in user
router.get("/me", verifyToken, getLoggedUser);
// Update Profile
router.put("/update-profile", verifyToken, updateProfile);

export default router;
