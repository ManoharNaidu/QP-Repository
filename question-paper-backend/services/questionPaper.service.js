import pdf from "pdf-parse/lib/pdf-parse.js";
import QuestionPaper from "../models/QuestionPaper.js";
import configureCloudinary from "../config/cloudinary.config.js";
import {
  buildBranchQuery,
  normalizeBranch,
  normalizeCourseCode,
  normalizeQuestionPaperPayload,
  parsePagination,
} from "../utils/questionPaper.utils.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.utils.js";

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createQuestionPaper = async ({ body, file }) => {
  if (!file) {
    throw createHttpError(400, "File not uploaded");
  }

  let extractedText = "";
  try {
    const data = await pdf(file.buffer);
    extractedText = data.text;
  } catch (err) {
    console.error("PDF Extraction failed:", err);
    // Continue without extraction if it fails, but log it
  }

  const payload = normalizeQuestionPaperPayload(body);

  const validModules = ["Base", "Bachelor", "Master"];
  if (!payload.module || !validModules.includes(payload.module)) {
    throw createHttpError(400, "Invalid or missing module");
  }

  if (!payload.courseCode || !/^[A-Z]{2}\d{5}$/.test(payload.courseCode)) {
    throw createHttpError(
      400,
      "Invalid courseCode. Expected 2 letters followed by 5 digits (e.g. AB12345).",
    );
  }

  const publicId =
    `${payload.module}_${payload.branch}_${payload.academicYear}_${payload.year}_${payload.cycle}_${payload.semester}_${payload.courseCode}.pdf`.replace(
      /[\s/]/g,
      "_",
    );

  const uploadResult = await uploadBufferToCloudinary({
    cloudinary: configureCloudinary(),
    buffer: file.buffer,
    publicId,
  });

  const paper = await QuestionPaper.findOneAndUpdate(
    {
      branch: buildBranchQuery(payload.branch),
      module: payload.module,
      academicYear: payload.academicYear,
      year: payload.year,
      cycle: payload.cycle,
      semester: payload.semester,
      courseCode: normalizeCourseCode(payload.courseCode),
    },
    {
      ...payload,
      branch: normalizeBranch(payload.branch),
      courseCode: normalizeCourseCode(payload.courseCode),
      fileUrl: uploadResult.secure_url,
      extractedText,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return {
    fileUrl: uploadResult.secure_url,
    paper,
  };
};

export const getQuestionPapers = async (queryParams) => {
  const {
    page,
    pageSize,
    module,
    branch,
    academicYear,
    year,
    semester,
    cycle,
    courseCode,
  } = normalizeQuestionPaperPayload(queryParams);

  const { currentPage, perPage, skip } = parsePagination({ page, pageSize });

  const query = {};

  if (module) query.module = module;
  if (branch) query.branch = buildBranchQuery(branch);
  if (academicYear) query.academicYear = academicYear;
  if (year) query.year = year;
  if (semester) query.semester = semester;
  if (cycle) query.cycle = cycle;
  if (courseCode) query.courseCode = normalizeCourseCode(courseCode);

  const [papers, totalCount] = await Promise.all([
    QuestionPaper.find(query)
      .sort({ year: -1, updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(perPage),
    QuestionPaper.countDocuments(query),
  ]);

  return {
    papers,
    pagination: {
      page: currentPage,
      pageSize: perPage,
      totalItems: totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
    },
    filters: {
      module,
      branch: branch ? normalizeBranch(branch) : "",
      academicYear,
      year,
      semester,
      cycle,
      courseCode: courseCode ? normalizeCourseCode(courseCode) : "",
    },
  };
};
