import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { createAd } from "../../controllers/website/adController.js";
import { getPublishedLands, getLandDetailById, placeBid } from "../../controllers/website/landAdsController.js";
import upload from "../uploads/upload.js";

const router = express.Router();

// Create ad route
router.post("/create", verifyToken, upload.array("images", 6), createAd);

// Land list
router.get("/published-lands", getPublishedLands);

// Land details by ID
router.get("/published-lands/:id", getLandDetailById);

// Place a bid (Protected)
router.post("/place-bid", verifyToken, placeBid);

export default router;
