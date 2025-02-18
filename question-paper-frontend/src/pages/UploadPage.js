import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
        "https://qp-repository.onrender.com/api/upload",
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto max-w-4xl bg-gradient-to-br from from-green-700 via-green-600 to-green-500 backdrop-blur-lg rounded-xl p-8 shadow-xl"
    >
      <h1 className="text-4xl font-bold mb-12 text-gray-100 text-center">
        Upload Question Papers
      </h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        onSubmit={handleUpload}
      >
        <div>
          <label className="block font-medium text-green-100 mb-2">
            Branch:
          </label>
          <select
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="" className="text-gray-800">
              Select Branch
            </option>
            <option value="CSE" className="text-gray-800">
              CSE
            </option>
            <option value="ECE" className="text-gray-800">
              ECE
            </option>
            <option value="ME" className="text-gray-800">
              ME
            </option>
            <option value="CE" className="text-gray-800">
              CE
            </option>
            <option value="EEE" className="text-gray-800">
              EEE
            </option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-green-100 mb-2">Year:</label>
          <select
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            <option value="" className="text-gray-800">
              Select Year
            </option>
            {Array.from({ length: new Date().getFullYear() - 2014 }).map(
              (_, idx) => {
                const yearOption = 2015 + idx;
                return (
                  <option
                    key={yearOption}
                    value={yearOption}
                    className="text-gray-800"
                  >
                    {yearOption}
                  </option>
                );
              }
            )}
          </select>
        </div>

        <div>
          <label className="block font-medium text-green-100 mb-2">
            Academic Year:
          </label>
          <select
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="" className="text-gray-800">
              Select Academic Year
            </option>
            <option value="1st Year" className="text-gray-800">
              1st Year
            </option>
            <option value="2nd Year" className="text-gray-800">
              2nd Year
            </option>
            <option value="3rd Year" className="text-gray-800">
              3rd Year
            </option>
            <option value="4th Year" className="text-gray-800">
              4th Year
            </option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-green-100 mb-2">
            Cycle:
          </label>
          <select
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
          >
            <option value="" className="text-gray-800">
              Select Cycle
            </option>
            <option value="Jan-Jun" className="text-gray-800">
              Jan-Jun
            </option>
            <option value="Jul-Dec" className="text-gray-800">
              Jul-Dec
            </option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-green-100 mb-2">
            Semester:
          </label>
          <select
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="" className="text-gray-800">
              Select Semester
            </option>
            <option value="Mid" className="text-gray-800">
              Mid Semester
            </option>
            <option value="End" className="text-gray-800">
              End Semester
            </option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-green-100 mb-2">
            Course Code:
          </label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Enter course code"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium text-green-100 mb-2">File:</label>
          <div className="relative">
            <input
              required
              type="file"
              accept=".pdf"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="md:col-span-2 w-full bg-gray-100 text-green-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-50 transition-colors mt-4"
        >
          Upload Paper
        </motion.button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-8 text-center font-medium rounded-lg py-3 ${
            message.includes("failed")
              ? "text-red-200 bg-red-500"
              : "text-green-200 bg-green-500"
          }`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default UploadPage;
