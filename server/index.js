import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import userRoutes from "./routes/users.js"
import commentRoutes from "./routes/comments.js"
import videoRoutes from "./routes/videos.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const connect = () =>{
    mongoose.connect(process.env.MONGO).then(() => {
        console.log("Mongo Db Connection Completed")
    }).catch(err => {throw err})
}

const app = express()

app.use(cookieParser())
app.use(cors(corsOptions))

app.listen(3000, () => {
    connect()
    console.log("Server is running on port 3000")
})

var corsOptions = {
    origin: '*',
    credentials: true,
};


const logger = (req,res,next) => {
    console.log(req.originalUrl)
    next()
}
app.use(logger)

app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    console.log("Hi")
    return res.status(status).json({
        success:false,
        status,
        message
    });
});

app.use(express.json())
app.use("/api/users",userRoutes)
app.use("/api/videos",videoRoutes)
app.use("/api/comments",commentRoutes)
app.use("/api/auth",authRoutes)



app.get("/",(req,res) => {
    res.send("Hello")
})