const BRANCH_ALIAS_MAP = {
  AE: "AE",
  CE: "CE",
  CSE: "CSE",
  ECE: "ECE",
  EE: "EE",
  EEE: "EE",
  ME: "ME",
};

/**
 * Trims string values and returns an empty string for non-string input.
 * @param {unknown} value Value to normalize.
 * @returns {string} Trimmed string or empty string.
 */
const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

/**
 * Normalizes branch aliases to canonical branch codes.
 * @param {unknown} branch Branch input from client payload.
 * @returns {string} Canonicalized branch code.
 */
export const normalizeBranch = (branch) => {
  const normalized = normalizeString(branch).toUpperCase();
  return BRANCH_ALIAS_MAP[normalized] || normalized;
};

/**
 * Normalizes course code formatting for storage and query consistency.
 * @param {unknown} courseCode Incoming course code value.
 * @returns {string} Uppercased and trimmed course code.
 */
export const normalizeCourseCode = (courseCode) =>
  normalizeString(courseCode).toUpperCase();

/**
 * Builds branch query criteria with support for EE/EEE compatibility.
 * @param {unknown} branch Branch filter value.
 * @returns {string | { $in: string[] }} MongoDB query value for branch filtering.
 */
export const buildBranchQuery = (branch) => {
  const normalized = normalizeBranch(branch);

  if (!normalized) {
    return "";
  }

  if (normalized === "EE") {
    return { $in: ["EE", "EEE"] };
  }

  return normalized;
};

/**
 * Normalizes the common question paper payload fields from body or query input.
 * @param {Record<string, unknown>} [payload={}] Raw payload object.
 * @returns {{ module: string, branch: string, academicYear: string, year: string, semester: string, cycle: string, courseCode: string, page: string, pageSize: string }} Normalized fields.
 */
export const normalizeQuestionPaperPayload = (payload = {}) => ({
  module: normalizeString(payload.module),
  branch: normalizeBranch(payload.branch),
  academicYear: normalizeString(payload.academicYear),
  year: normalizeString(payload.year),
  semester: normalizeString(payload.semester),
  cycle: normalizeString(payload.cycle),
  courseCode: normalizeCourseCode(payload.courseCode),
  page: normalizeString(payload.page),
  pageSize: normalizeString(payload.pageSize),
});

/**
 * Parses page and pageSize query values into safe pagination metadata.
 * @param {{ page?: string, pageSize?: string }} params Pagination input values.
 * @returns {{ currentPage: number, perPage: number, skip: number }} Parsed pagination values.
 */
export const parsePagination = ({ page, pageSize }) => {
  const currentPage = Math.max(1, Number.parseInt(page || "1", 10) || 1);
  const perPage = Math.max(1, Number.parseInt(pageSize || "10", 10) || 10);
  const skip = (currentPage - 1) * perPage;

  return {
    currentPage,
    perPage,
    skip,
  };
};
