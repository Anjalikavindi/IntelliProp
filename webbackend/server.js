import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; 
import { fileURLToPath } from 'url';
import authRoutes from "./routes/website/authRoutes.js";
import otpRoutes from "./routes/website/otpRoutes.js";
import adRoutes from "./routes/website/adRoutes.js";
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.js";
import adminAdsRoutes from "./routes/admin/adminAdsRoutes.js";
import adminUserRoutes from "./routes/admin/UserRoutes.js";
import districtRoutes from "./routes/website/districtRoutes.js";
import areaRoutes from "./routes/website/areaRoutes.js";
import predictionRoutes from "./routes/website/predictionRoutes.js";
import chatRoutes from "./routes/website/chatRoutes.js";
import startAuctionCron from "./services/auctionCron.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, 'public', 'ad_images');
app.use('/images', express.static(uploadsPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/ads", adRoutes);

//Admin
app.use("/api/admin/auth", adminAuthRoutes);
//Ads
app.use("/api/admin/ads", adminAdsRoutes);
//Users
app.use("/api/admin/users", adminUserRoutes);
//District list
app.use("/api/districts", districtRoutes);
//Areas
app.use("/api/areas", areaRoutes);
//House Price Prediction
app.use("/api/predict", predictionRoutes);

// Chat Route
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize the Cron Job
  startAuctionCron(); 
  console.log("Auction Cron Job Initialized.");
});
