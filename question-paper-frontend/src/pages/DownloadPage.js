import React, { useState } from "react";
import axios from "axios";

const DownloadPage = () => {
  const [branch, setBranch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [cycle, setCycle] = useState("");
  const [papers, setPapers] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/api/download", {
        params: {
          branch,
          academicYear,
          year,
          semester,
          cycle,
        },
      });
      setPapers(response.data.papers);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("No question papers found.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-1/2">
      <h1 className="text-2xl font-bold mb-6">Download Question Papers</h1>
      <form className="space-y-4" onSubmit={handleSearch}>
        <div>
          <label className="block font-medium">Branch:</label>
          <select
            required
            className="border rounded p-2 w-full"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
            <option value="EEE">EEE</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Year:</label>
          <select
            required
            className="border rounded p-2 w-full"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {Array.from({ length: new Date().getFullYear() - 2014 }).map(
              (_, idx) => {
                const yearOption = 2015 + idx;
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                );
              }
            )}
          </select>
        </div>
        <div>
          <label className="block font-medium">Academic Year:</label>
          <select
            required
            className="border rounded p-2 w-full"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select Academic Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Semester:</label>
          <select
            required
            className="border rounded p-2 w-full"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            <option value="Mid">Mid Semester</option>
            <option value="End">End Semester</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Cycle:</label>
          <select
            required
            className="border rounded p-2 w-full"
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
          >
            <option value="">Select Cycle</option>
            <option value="Jan-Jun">Jan-Jun</option>
            <option value="Jul-Dec">Jul-Dec</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Search
        </button>
      </form>

      {message ? (
        <p className="text-red-500 mt-4">{message}</p>
      ) : (
        <div className="mt-6">
          {papers.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Results:</h2>
              <ul className="space-y-2">
                {papers.map((paper) => (
                  <li
                    key={paper._id}
                    className="border p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <b>Branch:</b> {paper.branch}
                      </p>
                      <p>
                        <b>Academic Year:</b> {paper.academicYear}
                      </p>
                      <p>
                        <b>Year:</b> {paper.year}
                      </p>
                      <p>
                        <b>Semester:</b> {paper.semester}
                      </p>
                      <p>
                        <b>Cycle:</b> {paper.cycle}
                      </p>
                    </div>
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
