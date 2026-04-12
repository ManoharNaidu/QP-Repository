import { createFeedback } from "../services/feedback.service.js";

/**
 * Accepts feedback payload and persists it through the feedback service.
 * @param {import("express").Request} req Incoming request containing feedback data.
 * @param {import("express").Response} res Express response.
 * @param {import("express").NextFunction} next Express error-forwarding callback.
 * @returns {Promise<void>} Resolves when a response is sent.
 */
export const submitFeedback = async (req, res, next) => {
  try {
    const feedback = await createFeedback(req.body);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    next(error);
  }
};
