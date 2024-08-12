import express from "express";
import {
  addVideoToHistory,
  deleteVideoToHistory,
  getUserWatchedVideos,
} from "../controllers/history.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUserWatchedVideos);

router.post("/", verifyToken, addVideoToHistory);

router.delete("/:id", verifyToken, deleteVideoToHistory);

export default router;
