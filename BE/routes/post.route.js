import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPost , deletePost ,commentOnPost , likeUnlikePost , getAllPosts ,getLikedPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/delete/:id", protectRoute, deletePost);

router.get("/likedPosts/:id", protectRoute, getLikedPosts);
export default router;