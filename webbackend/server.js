import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/website/authRoutes.js";
import otpRoutes from "./routes/website/otpRoutes.js";
import adRoutes from "./routes/website/adRoutes.js";
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/ads", adRoutes);

//Admin
app.use("/api/admin/auth", adminAuthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
