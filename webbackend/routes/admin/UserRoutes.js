import express from "express";
import { getUsersList, deleteUser } from "../../controllers/admin/userController.js";

const router = express.Router();

router.get("/", getUsersList);
router.delete("/:id", deleteUser);

export default router;