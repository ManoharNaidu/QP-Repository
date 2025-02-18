import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "feedback" } // Store in the "feedback" collection
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
