import mongoose from "mongoose";

const SavedVideoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    lastTimeWatch: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Middleware to set `lastTimeWatch` before saving
SavedVideoSchema.pre("save", function (next) {
  this.lastTimeWatch = new Date();
  next();
});

// Middleware to update `lastTimeWatch` before updating
SavedVideoSchema.pre("findOneAndUpdate", function (next) {
  this._update.lastTimeWatch = new Date();
  next();
});

const SavedVideo = mongoose.model("SavedVideo", SavedVideoSchema);

export default SavedVideo;
