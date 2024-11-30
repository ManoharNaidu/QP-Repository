const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "feedback" } // Store in the "feedback" collection
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
