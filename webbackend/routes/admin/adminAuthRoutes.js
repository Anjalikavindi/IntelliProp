import express from "express";
import { registerAdmin, loginAdmin } from "../../controllers/admin/adminAuthController.js";
import { getAdminRoles } from "../../controllers/admin/adminRoleController.js";

const router = express.Router();

// Admin Registration Route
router.post("/admin-register", registerAdmin);

// Admin Login Route
router.post("/admin-login", loginAdmin);

// Fetch Admin Roles Route
router.get("/roles", getAdminRoles);

export default router;
