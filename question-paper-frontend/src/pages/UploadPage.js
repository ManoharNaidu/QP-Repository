import React, { useState } from "react";
import axios from "axios";

const UploadPage = () => {
  const [branch, setBranch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [cycle, setCycle] = useState("");
  const [file, setFile] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("branch", branch);
    formData.append("academicYear", academicYear);
    formData.append("year", year);
    formData.append("cycle", cycle);
    formData.append("semester", semester);
    formData.append("courseCode", courseCode);

    try {
      setMessage("Uploading file...");
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-1/2">
      <h1 className="text-2xl font-bold mb-6">Upload Question Papers</h1>
      <form className="space-y-4" onSubmit={handleUpload}>
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
          <label className="block font-medium">Course Code:</label>
          <input
            required
            type="text"
            className="border rounded p-2 w-full"
            onChange={(e) => setCourseCode(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">File:</label>
          <input
            required
            type="file"
            accept=".pdf"
            className="border rounded p-2 w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>

      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default UploadPage;
