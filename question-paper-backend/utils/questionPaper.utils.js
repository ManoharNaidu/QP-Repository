const BRANCH_ALIAS_MAP = {
  AE: "AE",
  CE: "CE",
  CSE: "CSE",
  ECE: "ECE",
  EE: "EE",
  EEE: "EE",
  ME: "ME",
};

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

export const normalizeBranch = (branch) => {
  const normalized = normalizeString(branch).toUpperCase();
  return BRANCH_ALIAS_MAP[normalized] || normalized;
};

export const normalizeCourseCode = (courseCode) =>
  normalizeString(courseCode).toUpperCase();

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
