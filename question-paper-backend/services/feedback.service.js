import Feedback from "../models/Feedback.js";

/**
 * Converts a UTC date into an ISO-like timestamp with explicit timezone offset.
 * @param {Date} date Source date.
 * @param {number} offsetMinutes Offset in minutes (e.g., 330 for IST).
 * @returns {string} Offset-adjusted timestamp string.
 */
const toOffsetIso = (date, offsetMinutes) => {
  const adjusted = new Date(date.getTime() + offsetMinutes * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  const milliseconds = String(adjusted.getMilliseconds()).padStart(3, "0");
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const hours = pad(Math.floor(absoluteOffset / 60));
  const minutes = pad(absoluteOffset % 60);

  return (
    `${adjusted.getFullYear()}-${pad(adjusted.getMonth() + 1)}-${pad(
      adjusted.getDate(),
    )}` +
    `T${pad(adjusted.getHours())}:${pad(adjusted.getMinutes())}:${pad(
      adjusted.getSeconds(),
    )}.${milliseconds}${sign}${hours}:${minutes}`
  );
};

/**
 * Validates and stores a feedback entry, then returns a response-safe DTO.
 * @param {{ content?: string, name?: string, email?: string, category?: string }} payload Feedback input fields.
 * @returns {Promise<{ id: unknown, name: string, email: string, category: string, createdAt: Date, createdAtIST: string }>} Persisted feedback payload for API responses.
 */
export const createFeedback = async ({ content, name, email, category }) => {
  if (!content) {
    const error = new Error("Feedback content is required");
    error.statusCode = 400;
    throw error;
  }

  const feedback = await Feedback.create({
    content,
    name: name || "Anonymous",
    email: email || "",
    category: category || "General",
  });

  return {
    id: feedback._id,
    name: feedback.name,
    email: feedback.email,
    category: feedback.category,
    createdAt: feedback.createdAt,
    createdAtIST: toOffsetIso(feedback.createdAt, 330),
  };
};
