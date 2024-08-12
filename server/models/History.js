import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
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
HistorySchema.pre("save", function (next) {
  this.lastTimeWatch = new Date();
  next();
});

// Middleware to update `lastTimeWatch` before updating
HistorySchema.pre("findOneAndUpdate", function (next) {
  this._update.lastTimeWatch = new Date();
  next();
});

const History = mongoose.model("History", HistorySchema);

export default History;
