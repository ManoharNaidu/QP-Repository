import mongoose from "mongoose";

const QPaperSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  module: {
    type: String,
    enum: ["Base", "Bachelor", "Master"],
    required: true,
  },
  year: { type: String, required: true },
  academicYear: { type: String, required: true },
  cycle: { type: String, required: true },
  semester: { type: String, required: true },
  courseCode: { type: String, required: true, match: /^[A-Z]{2}\d{5}$/ },
  fileUrl: { type: String, required: true },
});

const QuestionPaper = mongoose.model("QPaper", QPaperSchema);

export default QuestionPaper;
