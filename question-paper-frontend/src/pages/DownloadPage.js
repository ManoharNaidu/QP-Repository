import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const DownloadPage = () => {
  const [filters, setFilters] = useState({
    branch: "",
    academicYear: "",
    year: "",
    semester: "",
    cycle: "",
    courseCode: "",
  });
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages

  const papersPerPage = 10; // Number of results per page

  // Dropdown options
  const branchOptions = ["CSE", "ECE", "ME", "CE", "EEE"];
  const currentYear = new Date().getFullYear();
  const YearOptions = Array.from(
    { length: new Date().getFullYear() - 2014 },
    (_, i) => `${currentYear - i}`
  );
  const AcademicYearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesterOptions = ["Mid", "End"];
  const cycleOptions = ["Jan-Jun", "Jul-Dec"];

  const fetchPapers = async () => {
    try {
      const response = await axios.get(
        // "https://qp-repository.onrender.com/api/download",
        "https://qp-repository-8vor.onrender.com/api/download",
        {
          params: filters,
        }
      );
      setPapers(response.data.papers);
      setTotalPages(Math.ceil(response.data.papers.length / papersPerPage)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching papers:", error);
      setPapers([]);
    }
  };

  useEffect(() => {
    fetchPapers(); // Fetch papers on page load or filter change
  }, []);

  // Handle input changes in the filters
  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle form submit to apply filters
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on filter change
    fetchPapers();
  };

  // New helper: build a sanitized filename from paper fields (adds timestamp to ensure uniqueness)
  const buildFileName = (paper) => {
    const parts = [
      paper.branch,
      paper.year,
      paper.academicYear,
      paper.cycle,
      paper.semester,
      paper.courseCode,
    ].map((p) => (p ? String(p) : "unknown"));

    // join with underscore and replace any non-word characters with underscore
    const base = parts.join("_").replace(/[^\w.-]+/g, "_");

    return `${base}.pdf`;
  };

  // New: download file directly instead of opening URL
  const downloadPaper = async (paper) => {
    try {
      const response = await axios.get(paper.fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: response.data.type || "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      // Use composed filename including branch, year, academicYear, cycle, semester, courseCode
      const filename = buildFileName(paper);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      // Optionally show user-facing error here
    }
  };

  // Paginate the papers based on the current page
  const paginateResults = () => {
    const startIndex = (currentPage - 1) * papersPerPage;
    const endIndex = startIndex + papersPerPage;
    return papers.slice(startIndex, endIndex);
  };

  // Handle page change
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      // className="container mx-auto max-w-3xl bg-gradient-to-br from-purple-800 via-purple-700 to-purple-600  backdrop-blur-lg rounded-xl p-8 shadow-xl"
    >
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-200">
        Download Question Papers
      </h1>

      {/* Main Layout */}
      <div className="flex flex-wrap gap-6">
        {/* Filter Section - White Card */}

        <div className="w-full sm:w-80 bg-gradient-to-br from-red-400 to-red-500 rounded-lg p-5 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <form className="flex flex-col gap-4" onSubmit={handleFilterSubmit}>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="">Select Branch</option>
              {branchOptions.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            <select
              name="year"
              value={filters.year}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="">Select Year</option>
              {YearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              name="academicYear"
              value={filters.academicYear}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="">Select Academic Year</option>
              {AcademicYearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              name="cycle"
              value={filters.cycle}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="">Select Cycle</option>
              {cycleOptions.map((cycle, index) => (
                <option key={index} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>

            <select
              name="semester"
              value={filters.semester}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="">Select Semester</option>
              {semesterOptions.map((semester, index) => (
                <option key={index} value={semester}>
                  {semester}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="courseCode"
              placeholder="Course Code"
              value={filters.courseCode}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-700"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-slate-950 py-2.5 rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {paginateResults().length === 0 ? (
              <p className="text-center  text-gray-500">
                No question papers found.
              </p>
            ) : (
              paginateResults().map((paper, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 border-2 border-slate-950 rounded-lg shadow-md flex flex-col h-full"
                >
                  <div>
                    <p>
                      <strong>Branch:</strong> {paper.branch}
                    </p>
                    <p>
                      <strong>Year:</strong> {paper.year}
                    </p>
                    <p>
                      <strong>Academic Year:</strong> {paper.academicYear}
                    </p>
                    <p>
                      <strong>Semester:</strong> {paper.semester}
                    </p>
                    <p>
                      <strong>Cycle:</strong> {paper.cycle}
                    </p>
                    <p>
                      <strong>Course Code:</strong> {paper.courseCode}
                    </p>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => downloadPaper(paper)}
                      className="w-full px-4 py-2 bg-gradient-to-br from-green-400 to-green-500 text-slate-950 rounded-md shadow-md"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fixed Pagination Controls at the Bottom */}
      <div className="flex justify-center bottom-0 left-0 right-0 p-2 m-2">
        <div className="flex justify-center">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-slate-950 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4 text-xl text-gray-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-slate-950 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadPage;
