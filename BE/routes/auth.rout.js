import express from "express";

import { signup , login , logout , getMe} from '../controllers/auth.controller.js';
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/logout", logout); // allow GET as well for robustness
router.get("/me", protectRoute, getMe);



export default router;