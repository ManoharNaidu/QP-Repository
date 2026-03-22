import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    name:     { type: String, default: "Anonymous" },
    email:    { type: String, default: "" },
    category: { type: String, default: "General" },
    content:  { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "feedback" }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
