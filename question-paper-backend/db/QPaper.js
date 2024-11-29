const mongoose = require("mongoose");

const QPaperSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  year: { type: String, required: true }, // New attribute: Year in college
  academicYear: { type: String, required: true }, // Renamed from 'year'
  semester: { type: String, required: true },
  cycle: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

module.exports = mongoose.model("QPaper", QPaperSchema);
