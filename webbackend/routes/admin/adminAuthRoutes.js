import express from "express";
import { registerAdmin, loginAdmin, getAdminsList, getAdminProfile, deleteAdmin } from "../../controllers/admin/adminAuthController.js";
import { getAdminRoles } from "../../controllers/admin/adminRoleController.js";

const router = express.Router();

// Admin Registration Route
router.post("/admin-register", registerAdmin);

// Admin Login Route
router.post("/admin-login", loginAdmin);

// Fetch Admin Roles Route
router.get("/roles", getAdminRoles);

// Admin Management
router.get("/admins", getAdminsList);
router.delete("/admins/:id", deleteAdmin);

// Profile Route
router.get("/profile/:id", getAdminProfile);

export default router;
