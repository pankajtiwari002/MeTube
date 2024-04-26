import express from "express"
import { addVideo, addView, deleteVideo, getByTag, getVideo, random, search, sub, trend, updateVideo } from "../controllers/video.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

router.post("/",verifyToken,addVideo)
 
router.put("/:id",verifyToken,updateVideo)
 
router.delete("/:id",verifyToken,deleteVideo)
 
router.get("/find/:id",getVideo)
 
router.put("/view/:id",addView)
 
router.post("/trend",trend)
 
router.post("/random",random)
 
router.post("/sub",verifyToken,sub)
 
router.get("/tags",getByTag)
 
router.get("/search",search)
 

export default router