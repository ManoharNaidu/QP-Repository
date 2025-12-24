import express from "express";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url"; // Import fileURLToPath
import dotenv from "dotenv";

// Import models
import QuestionPaper from "./models/QuestionPaper.js";
import Feedback from "./models/Feedback.js";

// Import configurations
import mongoDB from "./config/mongodb.config.js";

// Import middleware
import arcjetMiddleware from "./middlewares/arcject.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// Add Cloudinary + streamifier
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure dotenv
dotenv.config();

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = undefined; // Not used now

// Initialize Cloudinary and MongoDB
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
mongoDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);
app.use(arcjetMiddleware);

// Multer: use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route -> Cloudinary
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const { branch, module, year, academicYear, cycle, semester, courseCode } =
    req.body;

  // Validate module
  const validModules = ["Base", "Bachelor", "Master"];
  if (!module || !validModules.includes(module)) {
    return res.status(400).json({ error: "Invalid or missing module" });
  }

  // Validate courseCode: exactly 2 letters followed by 5 digits, no spaces
  const courseCodePattern = /^[A-Z]{2}\d{5}$/;
  if (!courseCode || !courseCodePattern.test(courseCode)) {
    return res.status(400).json({
      error:
        "Invalid courseCode. Expected 2 letters followed by 5 digits (e.g. AB12345).",
    });
  }

  if (!req.file) {
    return res.status(400).json({ error: "File Not Uploaded" });
  }

  // Build a stable public id (no extension)
  const publicId =
    `${module}_${branch}_${academicYear}_${year}_${cycle}_${semester}_${courseCode}.pdf`.replace(
      /[\s/]/g,
      "_"
    );

  try {
    // Upload buffer to Cloudinary as raw (for pdf)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "question-papers",
          resource_type: "raw",
          public_id: publicId,
          overwrite: true,
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    // Save metadata to MongoDB (use secure_url from Cloudinary)
    await QuestionPaper.findOneAndUpdate(
      { branch, module, academicYear, year, cycle, semester, courseCode },
      {
        module,
        branch,
        academicYear,
        year,
        cycle,
        semester,
        courseCode,
        fileUrl: result.secure_url,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "File uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Download route
app.get("/api/download", async (req, res) => {
  try {
    const { branch, module, academicYear, year, semester, cycle, courseCode } =
      req.query;

    // Query MongoDB for matching question papers
    const query = {};
    if (branch) query.branch = branch;
    if (module) query.module = module;
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

    // Convert createdAt to IST (UTC+05:30) in an ISO-like format with offset
    const toIstIso = (date) => {
      const d = new Date(date);
      // IST offset in minutes
      const istOffsetMinutes = 5.5 * 60;
      const ist = new Date(d.getTime() + istOffsetMinutes * 60 * 1000);
      const pad = (n) => String(n).padStart(2, "0");
      const ms = String(ist.getMilliseconds()).padStart(3, "0");
      return (
        `${ist.getFullYear()}-${pad(ist.getMonth() + 1)}-${pad(
          ist.getDate()
        )}` +
        `T${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(
          ist.getSeconds()
        )}.${ms}+05:30`
      );
    };

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: {
        id: feedback._id,
        createdAt: feedback.createdAt, // original stored date (UTC)
        createdAtIST: toIstIso(feedback.createdAt), // ISO-like string in IST
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
