import Feedback from "../models/Feedback.js";

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
