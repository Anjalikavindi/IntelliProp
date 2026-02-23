import express from "express";
import { predictHousePrice } from "../../controllers/website/predictionController.js";

const router = express.Router();

router.post("/house-price", predictHousePrice);

export default router;