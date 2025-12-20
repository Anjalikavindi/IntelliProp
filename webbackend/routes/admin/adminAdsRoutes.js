import express from "express";
import { getHouseAdsList, publishAd, rejectAd } from "../../controllers/admin/houseAdsController.js";
import { getLandAdsList, toggleLandBidding } from "../../controllers/admin/landAdsController.js";
import { getAuctionAdsList } from "../../controllers/admin/auctionAdsController.js";

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

// Auction Routes 
router.get("/auctions", getAuctionAdsList);

export default router;