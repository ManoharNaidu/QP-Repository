import {
  createQuestionPaper,
  getQuestionPapers,
} from "../services/questionPaper.service.js";

/**
 * Handles multipart uploads for question papers and returns the stored record.
 * @param {import("express").Request} req Incoming request containing form fields and file.
 * @param {import("express").Response} res Express response.
 * @param {import("express").NextFunction} next Express error-forwarding callback.
 * @returns {Promise<void>} Resolves when a response is sent.
 */
export const uploadQuestionPaper = async (req, res, next) => {
  try {
    const result = await createQuestionPaper({
      body: req.body,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      url: result.fileUrl,
      paper: result.paper,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns paginated question papers based on optional filter query parameters.
 * @param {import("express").Request} req Incoming request containing filter query params.
 * @param {import("express").Response} res Express response.
 * @param {import("express").NextFunction} next Express error-forwarding callback.
 * @returns {Promise<void>} Resolves when a response is sent.
 */
export const downloadQuestionPapers = async (req, res, next) => {
  try {
    const result = await getQuestionPapers(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
