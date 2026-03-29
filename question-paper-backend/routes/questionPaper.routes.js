import express from "express";
import multer from "multer";

import {
  downloadQuestionPapers,
  uploadQuestionPaper,
} from "../controllers/questionPaper.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadQuestionPaper);
router.get("/download", downloadQuestionPapers);

export default router;
