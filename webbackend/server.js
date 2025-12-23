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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
