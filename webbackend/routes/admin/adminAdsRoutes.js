import express from "express";
import { getHouseAdsList } from "../../controllers/admin/houseAdsController.js";
// You would typically import middleware here, like a token verification/admin check

const router = express.Router();

// Route to fetch all house ads (Residencies List)
router.get("/residencies", getHouseAdsList);

export default router;