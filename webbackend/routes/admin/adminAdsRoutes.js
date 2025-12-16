import express from "express";
import { getHouseAdsList, publishAd, rejectAd } from "../../controllers/admin/houseAdsController.js";
// You would typically import middleware here, like a token verification/admin check

const router = express.Router();

// Route to fetch all house ads (Residencies List)
router.get("/residencies", getHouseAdsList);

// Route to publish a specific ad
router.put("/publish/:adId", publishAd);

// Route to reject a specific ad
router.put("/reject/:adId", rejectAd);

export default router;