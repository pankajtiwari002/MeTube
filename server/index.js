import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";
import videoRoutes from "./routes/videos.js";
import historyRoutes from "./routes/history.js";
import savedVideoRoutes from "./routes/savedVideo.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import sendOtp from "./util/mail.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Mongo Db Connection Completed");
    })
    .catch((err) => {
      throw err;
    });
};

const app = express();

var corsOptions = {
  origin: "https://vidzilla-frontend.onrender.com",
  credentials: true,
};

app.options("/api/auth/google", cors(corsOptions)); // Enable pre-flight request for specific endpoint

app.use(cors(corsOptions));
app.use(cookieParser());

app.listen(PORT, () => {
  connect();
  console.log("Server is running on port 3000");
});

const logger = (req, res, next) => {
  console.log(req.originalUrl);
  next();
};
app.use(logger);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  console.log("Hi");
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/history", savedVideoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/email", async (req, res) => {
  try {
    const info = await sendOtp(
      "pankajtiwari.cse25@jecrc.ac.in",
      "Pankaj Tiwari",
      "123456"
    );
    res.json(info);
  } catch (error) {
    console.log(error);
    res.send("error occur");
  }
});
