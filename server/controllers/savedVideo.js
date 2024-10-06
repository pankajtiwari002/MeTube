import SavedVideo from "../models/SavedVideo.js";

export const findById = async (req, res, next) => {
  try {
    const video = await SavedVideo.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const checkAlreadySaved = async (req, res, next) => {
  try {
    const savedVideo = await SavedVideo.find({
      videoId: req.body.videoId,
      userId: req.body.userId,
    });
    console.log(savedVideo);
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const getUserSavedVideos = async (req, res, next) => {
  try {
    const savedVideos = await SavedVideo.find({
      userId: req.params.id,
    }).sort({ lastTimeWatch: -1 });
    res.status(200).json(savedVideos);
  } catch (err) {
    next(err);
  }
};

export const addVideoToSavedVideo = async (req, res, next) => {
  try {
    const savedVideo = await SavedVideo.find({
      userId: req.body.userId,
      videoId: req.body.videoId,
    });
    if (savedVideo.length == 0) {
      const video = new SavedVideo({ ...req.body });
      await video.save();
      res.status(200).json(video);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideoToSavedVideo = async (req, res, next) => {
  try {
    const video = await SavedVideo.findByIdAndDelete(req.params.id);
    res.status(202).send("successfully delete");
  } catch (err) {
    next(err);
  }
};
