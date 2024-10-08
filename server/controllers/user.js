import User from "../models/User.js";
import { createError } from "../error.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { subscribedUsers: req.params.id } },
      { new: true }
    );
    console.log(user);
    const user2 = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { subscribers: 1 } },
      { new: true }
    );
    console.log(user2);
    res.status(200).json("Subscription Successfull");
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { subscribedUsers: req.params.id } }
    );
    await User.updateOne({ _id: req.params.id }, { $inc: { subscribers: -1 } });
    res.status(200).json("UnSubscription Successfull");
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { likes: req.user.id },
      $pull: { dislikes: req.user.id },
    });
    res.status(200).json("The video has been liked");
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { dislikes: req.user.id },
      $pull: { likes: req.user.id },
    });
    res.status(200).json("The video has been disliked");
  } catch (err) {
    next(err);
  }
};

export const getAllSubscribedChannels = async (req,res,next) => {
  try {
    const user = await User.findById(req.params.id);
    const subscribedUserIds = user.subscribedUsers;
    let subscribedUsers = [];
    for(let id of subscribedUserIds){
      const subscribedUser = await User.findById(id);
      subscribedUsers.push(subscribedUser)
    }
    res.status(200).json(subscribedUsers)
  } catch (err) {
    next(err)
  }
}
