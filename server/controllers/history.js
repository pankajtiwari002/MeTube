import History from "../models/History.js";

export const findById = async (req, res, next) => {
  try {
    const video = await History.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const getUserWatchedVideos = async (req, res, next) => {
  try {
    const watchedVideos = await History.find({
      userId: req.params.id,
    }).sort({ lastTimeWatch: -1 });
    res.status(200).json(watchedVideos);
  } catch (err) {
    next(err);
  }
};

export const addVideoToHistory = async (req, res, next) => {
  try {
    const alreadyWatched = await History.find({
      userId: req.body.userId,
      videoId: req.body.videoId,
    });
    if (alreadyWatched.length > 0) {
      const video = await History.findOneAndUpdate(
        { userId: req.body.userId, videoId: req.body.videoId },
        { $set: { lastTimeWatch: Date.now() } },
        { new: true } // Optionally return the updated document
      );
    } else {
      const video = new History({ ...req.body });
      await video.save();
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideoToHistory = async (req, res, next) => {
  try {
    const video = await History.findByIdAndDelete(req.params.id);
    res.status(202).send("successfully delete")
  } catch (err) {
    next(err);
  }
};
