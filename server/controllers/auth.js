import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import { json } from "express";
import sendOtp from "../util/mail.js";
import Otp from "../models/Otp.js";

export const sendOtpUsingEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const otp = Math.floor(1000 + 8999 * Math.random());
    if (user) {
      res.status(409).json({ error: "email already exist" });
      return;
    }
    const otpPrevRecord = await Otp.findOne({ email: req.body.email });
    if (otpPrevRecord) {
      const date = new Date();
      date = date.setMinutes(date.getMinutes() + 5);
      Otp.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            otp: req.body.otp,
            expirationDate: new Date(Date.now() + 30000),
          },
        }
      );
      const info = await sendOtp(req.body.email, req.body.username, otp);
      res.status(200).json({ success: "Send Otp Successfull" });
      return;
    }
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    const OtpModel = new Otp({
      email: req.body.email,
      otp: otp,
      expirationDate: date,
    });
    await OtpModel.save();
    const info = await sendOtp(req.body.email, req.body.username, otp);
    res.status(200).json({ success: "Send Otp Successfull" });
  } catch (err) {
    next(err);
  }
};

export const verifyEmailUsingOtp = async (req, res, next) => {
  try {
    const otpRecord = await Otp.findOne({ email: req.body.email });
    console.log(otpRecord);
    if (!otpRecord) {
      console.log("Otp not found or already used");
      res.status(404).json({ error: "Otp not found or already used" });
    } else if (Date.now() > otpRecord.expirationDate) {
      console.log("Otp expire");
      const response = await Otp.findOneAndDelete({ email: req.body.email });
      res.status(400).json({ error: "Otp Expire" });
    } else if (otpRecord.attempts > 5) {
      console.log("Too Many Attempts");
      const response = await Otp.findOneAndDelete({ email: req.body.email });
      res.status(400).json({ error: "Too Many Attempts" });
    } else if (otpRecord.otp === req.body.otp) {
      console.log("Success");
      res.status(200).json({ Success: "Email verified successfully" });
    } else {
      console.log("Invalid Otp");
      const response = await Otp.findOneAndUpdate(
        { email: req.body.email },
        { $inc: { attempts: 1 } }
      );
      res.status(400).json({ error: "Invalid Otp" });
    }
  } catch (error) {
    next(err);
  }
};

export const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(hash);
    const newUser = new User({ ...req.body, password: hash });
    console.log(newUser);
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT);
    // res.status(201).send("User has been Created!");
    res
      .cookie("access_token", token, {
        httpOnly: true, // Protects against XSS attacks
        secure: true, // Ensures the cookie is only sent over HTTPS
        sameSite: "None", // Allows cross-site cookie usage (e.g., with OAuth)
        path: "/", // Available throughout the website
        domain: ".onrender.com",
      })
      .status(201)
      .send("user has been created");
  } catch (err) {
    //todo
    console.log(err.message);
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));
    console.log(req.body);
    console.log(user);

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credentials"));
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    console.log(token);
    const { password, ...others } = user._doc;
    others["access_token"] = token;
    res
      .cookie("access_token", token, {
        httpOnly: true, // Protects against XSS attacks
        secure: true, // Ensures the cookie is only sent over HTTPS
        sameSite: "None", // Allows cross-site cookie usage (e.g., with OAuth)
        path: "/", // Available throughout the website
        domain: ".onrender.com",
      })
      .status(200)
      .json(others);
  } catch (err) {
    //todo
    console.log(err.message);
    next(err);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    console.log("Hi1");
    const user = await User.findOne({ email: req.body.email });
    console.log("Hi2");
    if (user) {
      console.log("Hi3");
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      console.log("Hi4");
      res
        .cookie("access_token", token, {
          httpOnly: true, // Protects against XSS attacks
          secure: true, // Ensures the cookie is only sent over HTTPS
          sameSite: "None", // Allows cross-site cookie usage (e.g., with OAuth)
          path: "/", // Available throughout the website
          domain: ".onrender.com",
        })
        .status(200)
        .json(user._doc);
    } else {
      console.log("Hello1");
      const newUser = new User({ ...req.body, fromGoogle: true });
      console.log("Hello2");
      const savedUser = await newUser.save();
      console.log("Hello3");
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      console.log("Hello4");
      res
        .cookie("access_token", token, {
          httpOnly: true, // Protects against XSS attacks
          secure: true, // Ensures the cookie is only sent over HTTPS
          sameSite: "None", // Allows cross-site cookie usage (e.g., with OAuth)
          path: "/", // Available throughout the website
          domain: ".onrender.com", 
        })
        .status(200);
      // .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
