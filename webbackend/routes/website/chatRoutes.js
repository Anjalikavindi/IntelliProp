import express from "express";
import { getChatResponse } from "../../controllers/website/chatController.js";

const router = express.Router();

router.post("/", getChatResponse);

export default router;