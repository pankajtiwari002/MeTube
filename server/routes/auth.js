import express from "express"
import { googleSignIn, sendOtpUsingEmail, signin, signup, verifyEmailUsingOtp } from "../controllers/auth.js"

const router = express.Router()

//Create a User
router.post("/signup", signup)

//Sign In
router.post("/signin", signin)


//Google Auth
router.post("/google", googleSignIn)

//send Otp
router.post("/sendotp",sendOtpUsingEmail)

//verify Otp
router.post("/verifyotp",verifyEmailUsingOtp)

export default router