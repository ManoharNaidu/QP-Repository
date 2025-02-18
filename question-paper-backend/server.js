import express from "express";
import multer from "multer";
import cors from "cors";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Import models
import QuestionPaper from "./models/QuestionPaper.js";
import Feedback from "./models/Feedback.js";

// Import configurations
import AWSconfig from "./config/AWS.config.js";
import mongoDB from "./config/mongodb.config.js";

// Import middleware
import arcjetMiddleware from "./middlewares/arcject.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();
AWSconfig();
mongoDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);
app.use(arcjetMiddleware);

// Multer upload and S3 setup
const upload = multer({ dest: "uploads/" });
const s3 = new AWS.S3();

// Upload route
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const { branch, year, academicYear, cycle, semester, courseCode } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "File Not Uploaded" });
  }

  const filePath = path.join(__dirname, req.file.path);
  const fileName =
    `${branch}_${academicYear}_${year}_${cycle}_${semester}_${courseCode}.pdf`.replace(
      /[\s/]/g,
      "_"
    );

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `question-papers/${fileName}`,
    Body: fs.createReadStream(filePath),
    ContentType: "application/pdf",
  };

  try {
    // Upload file to S3
    const data = await s3.upload(params).promise();

    // Remove the file from local uploads folder
    fs.unlinkSync(filePath);

    // Save metadata to MongoDB
    await QuestionPaper.findOneAndUpdate(
      { branch, academicYear, year, cycle, semester, courseCode },
      { fileUrl: data.Location }, // S3 file URL
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Download route
app.get("/api/download", async (req, res) => {
  try {
    const { branch, academicYear, year, semester, cycle, courseCode } =
      req.query;

    // Query MongoDB for matching question papers
    const query = {};
    if (branch) query.branch = branch;
    if (academicYear) query.academicYear = academicYear;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (cycle) query.cycle = cycle;
    if (courseCode) query.courseCode = courseCode;

    const papers = await QuestionPaper.find(query);

    if (papers.length === 0) {
      return res.status(404).json({ message: "No question papers found." });
    }

    res.status(200).json({ papers });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Feedback route
app.post("/api/feedback", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Feedback content is required" });
    }

    const feedback = new Feedback({ content });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
