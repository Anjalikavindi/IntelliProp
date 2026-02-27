import express from "express";
import { predictHousePrice } from "../../controllers/website/predictionController.js";
import { getRecommendations } from "../../controllers/website/recommendationController.js";

const router = express.Router();

router.post("/house-price", predictHousePrice);

router.get("/recommendations/:id", getRecommendations);

export default router;