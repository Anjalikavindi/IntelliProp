import express from "express";
import { getHouseAdsList, publishAd, rejectAd } from "../../controllers/admin/houseAdsController.js";
import { getLandAdsList, toggleLandBidding } from "../../controllers/admin/landAdsController.js";

const router = express.Router();

// Route to fetch all house ads (Residencies List)
router.get("/residencies", getHouseAdsList);
// Route to publish a specific ad
router.put("/publish/:adId", publishAd);
// Route to reject a specific ad
router.put("/reject/:adId", rejectAd);

// Land Routes
router.get("/lands", getLandAdsList);
router.put("/lands/toggle-bid/:adId", toggleLandBidding);

export default router;