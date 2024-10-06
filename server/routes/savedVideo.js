import express from "express";
import {
  addVideoToSavedVideo,
  deleteVideoToSavedVideo,
  getUserSavedVideos,
  checkAlreadySaved,
} from "../controllers/savedVideo.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUserSavedVideos);

router.post("/", verifyToken, addVideoToSavedVideo);

router.post("/check", verifyToken, checkAlreadySaved);

router.delete("/:id", verifyToken, deleteVideoToSavedVideo);

export default router;
