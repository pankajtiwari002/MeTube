import express from "express"
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, update,getAllSubscribedChannels } from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

//update a user
router.put("/:id",verifyToken,update)

//delete a user
router.delete("/:id",verifyToken,deleteUser)

//get a user
router.get("/find/:id",getUser)

//subscribe a user
router.put("/sub/:id",verifyToken,subscribe)

//unsubscribe a user
router.put("/unsub/:id",verifyToken,unsubscribe)

//like a video
router.put("/like/:videoId",verifyToken,like)

//dislike a video
router.put("/dislike/:videoId",verifyToken,dislike)

//getSubscribedUser
router.get("/sub/:id",verifyToken,getAllSubscribedChannels)

export default router