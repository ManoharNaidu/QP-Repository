const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const QPapers = require("./db/QPaper");
const cors = require("cors");
require("./db/CloudinaryConfig");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cloudinary storage for Multer with renamed files
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { branch, academicYear, year, semester, cycle } = req.body;
    console.log(req.body);

    const publicId =
      `${branch}_${academicYear}_${year}_${semester}_${cycle}`.replace(
        /[\s/]/g,
        "_"
      ); // Replace spaces or slashes with underscores
    return {
      folder: "question-papers",
      resource_type: "raw",
      format: "pdf",
      public_id: publicId,
    };
  },
});

const upload = multer({ storage });

// Upload route
app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log(req.body);

  const { branch, academicYear, year, semester, cycle } = req.body;

  try {
    // Save the metadata and file URL in MongoDB
    const fileUrl = req.file.path;

    // Update or insert a new record
    const updatedQPaper = await QPapers.findOneAndUpdate(
      { branch, academicYear, year, semester, cycle },
      { fileUrl },
      { upsert: true, new: true } // Insert if not found, return the updated document
    );

    res
      .status(201)
      .json({ message: "QPaper uploaded successfully", paper: updatedQPaper });
  } catch (error) {
    console.error("Upload error", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Download route
app.get("/api/download", async (req, res) => {
  try {
    const { branch, academicYear, year, semester, cycle } = req.query;

    // Query MongoDB for matching question papers
    const query = {};
    if (branch) query.branch = branch;
    if (academicYear) query.academicYear = academicYear;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (cycle) query.cycle = cycle;

    const papers = await QPapers.find(query);

    if (papers.length === 0) {
      return res.status(404).json({ message: "No question papers found." });
    }

    res.status(200).json({ papers });
  } catch (error) {
    console.error("Download error", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
