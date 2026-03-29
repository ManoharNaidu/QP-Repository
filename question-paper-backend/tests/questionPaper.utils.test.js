import test from "node:test";
import assert from "node:assert/strict";

import {
  buildBranchQuery,
  normalizeBranch,
  normalizeCourseCode,
  parsePagination,
} from "../utils/questionPaper.utils.js";

test("normalizeBranch keeps canonical values", () => {
  assert.equal(normalizeBranch("CSE"), "CSE");
  assert.equal(normalizeBranch("ee"), "EE");
});

test("normalizeBranch maps legacy aliases", () => {
  assert.equal(normalizeBranch("EEE"), "EE");
});

test("buildBranchQuery keeps legacy EE records searchable", () => {
  assert.deepEqual(buildBranchQuery("EE"), { $in: ["EE", "EEE"] });
});

test("normalizeCourseCode trims and uppercases input", () => {
  assert.equal(normalizeCourseCode(" cs12345 "), "CS12345");
});

test("parsePagination provides safe defaults", () => {
  assert.deepEqual(parsePagination({ page: "", pageSize: "" }), {
    currentPage: 1,
    perPage: 10,
    skip: 0,
  });
});
