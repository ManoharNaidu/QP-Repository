import {
  BRANCH_OPTIONS,
  MODULE_OPTIONS,
  PAPER_PAGE_SIZE,
} from "./constants/questionPaper";

test("uses normalized question paper constants", () => {
  expect(MODULE_OPTIONS).toEqual(["Base", "Bachelor", "Master"]);
  expect(BRANCH_OPTIONS.find((option) => option.value === "EE")).toBeTruthy();
  expect(PAPER_PAGE_SIZE).toBe(10);
});
