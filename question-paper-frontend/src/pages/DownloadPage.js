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
      const response = await axios.get(
        "https://qp-repository.onrender.com/api/download",
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
    <div className="bg-gradient-to-br from-blue-300 to-blue-500 p-6 flex-auto container mx-auto pt-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Download Question Papers
      </h1>

      {/* Main Layout */}
      <div className="flex flex-wrap gap-8 px-4">
        {/* Filter Section - White Card */}
        <div className="w-full sm:w-80 bg-gradient-to-br from-red-300 to-red-500 rounded-lg p-6 shadow-lg">
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
              name="academicYear"
              value={filters.academicYear}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="">Select Academic Year</option>
              {academicYearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
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
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
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
              className="w-full bg-blue-500 text-black py-2.5 rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="flex-initial">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {paginateResults().length === 0 ? (
              <p className="text-center  text-gray-500 justify-center">
                No question papers found.
              </p>
            ) : (
              paginateResults().map((paper, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 border-2 border-black rounded shadow-md flex flex-col h-full"
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

                  <div className="flex justify-center mt-4 ">
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-gradient-to-br from-green-300 to-green-500  text-black rounded hover:bg-green-700 shadow-md text-center"
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
            className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4 text-xl">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
