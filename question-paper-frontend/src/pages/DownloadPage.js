import React, { useState, useEffect } from "react";
import axios from "axios";

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

  const papersPerPage = 6; // Number of results per page

  // Dropdown options
  const branchOptions = ["CSE", "ECE", "ME", "CE", "EEE"];
  const currentYear = new Date().getFullYear();
  const academicYearOptions = Array.from(
    { length: new Date().getFullYear() - 2014 },
    (_, i) => `${currentYear - i}`
  );
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesterOptions = ["Mid Sem", "End Sem"];
  const cycleOptions = ["Jan-Jun", "July-Dec"];

  const fetchPapers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/download", {
        params: filters,
      });
      setPapers(response.data.papers);
      setTotalPages(Math.ceil(response.data.papers.length / papersPerPage)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching papers:", error);
      setPapers([]);
    }
  };

  useEffect(() => {
    fetchPapers(); // Fetch papers on page load or filter change
  }, [filters]);

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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Download Question Papers
      </h1>

      {/* Flexbox Layout for Filters and Results */}
      <div className="flex flex-wrap">
        {/* Filter Section (1/4 width) */}
        <div className="w-full sm:w-1/4 p-4">
          <form className="flex flex-col gap-4" onSubmit={handleFilterSubmit}>
            <h2 className="text-xl font-semibold">Filters</h2>
            {/* Branch Dropdown */}
            <select
              name="branch"
              value={filters.branch}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded shadow-md"
            >
              <option value="">Branch</option>
              {branchOptions.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>

            {/* Academic Year Dropdown */}
            <select
              name="academicYear"
              value={filters.academicYear}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded shadow-md"
            >
              <option value="">Academic Year</option>
              {academicYearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              name="year"
              value={filters.year}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded shadow-md"
            >
              <option value="">Year</option>
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Semester Dropdown */}
            <select
              name="semester"
              value={filters.semester}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded shadow-md"
            >
              <option value="">Semester</option>
              {semesterOptions.map((semester, index) => (
                <option key={index} value={semester}>
                  {semester}
                </option>
              ))}
            </select>

            {/* Cycle Dropdown */}
            <select
              name="cycle"
              value={filters.cycle}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded shadow-md"
            >
              <option value="">Cycle</option>
              {cycleOptions.map((cycle, index) => (
                <option key={index} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>

            {/* Course Code Input */}
            <input
              type="text"
              name="courseCode"
              placeholder="Course Code"
              value={filters.courseCode}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded shadow-md"
            />

            {/* Filter Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-lg"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Results Section (3/4 width) */}
        <div className="w-full sm:w-3/4 p-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {paginateResults().length === 0 ? (
              <p className="text-center  text-gray-500 justify-center">
                No question papers found.
              </p>
            ) : (
              paginateResults().map((paper, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded shadow-md flex flex-col justify-between h-full"
                >
                  <div>
                    <p>
                      <strong>Branch:</strong> {paper.branch}
                    </p>
                    <p>
                      <strong>Academic Year:</strong> {paper.academicYear}
                    </p>
                    <p>
                      <strong>Year:</strong> {paper.year}
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

                  {/* Align the Download button to the right and center it vertically */}
                  <div className="mt-4 flex justify-start items-center h-full">
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow-md"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fixed Pagination Controls at the Bottom */}
      <div className="flex justify-center bottom-0 left-0 right-0 py-4 shadow-lg">
        <div className="flex justify-center">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4 text-xl">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
