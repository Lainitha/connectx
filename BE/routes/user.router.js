import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);

export default router;
