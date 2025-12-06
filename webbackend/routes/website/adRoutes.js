import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { createAd } from "../../controllers/website/adController.js";
import upload from "../uploads/upload.js";

const router = express.Router();

// Create ad route
router.post("/create", verifyToken, upload.array("images", 6), createAd);

export default router;
