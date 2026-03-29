import mongoose from "mongoose";

const QPaperSchema = new mongoose.Schema(
  {
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
    courseCode: {
      type: String,
      required: true,
      uppercase: true,
      match: /^[A-Z]{2}\d{5}$/,
    },
    fileUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

QPaperSchema.index({
  branch: 1,
  module: 1,
  academicYear: 1,
  year: 1,
  cycle: 1,
  semester: 1,
  courseCode: 1,
});

const QuestionPaper = mongoose.model("QPaper", QPaperSchema);

export default QuestionPaper;
