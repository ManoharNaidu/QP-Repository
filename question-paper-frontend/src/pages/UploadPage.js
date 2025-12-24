import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const UploadPage = () => {
  const [module, setModule] = useState("");
  const [branch, setBranch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [cycle, setCycle] = useState("");
  const [file, setFile] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0); // Add this new state

  const currentYear = new Date().getFullYear();
  const yearStart = 2020;
  const years = Array.from(
    { length: currentYear - yearStart + 1 },
    (_, i) => currentYear - i
  );

  const academicOptions =
    module === "Bachelor"
      ? ["1st Year", "2nd Year", "3rd Year", "4th Year"]
      : ["1st Year", "2nd Year"];

  useEffect(() => {
    if (academicYear && !academicOptions.includes(academicYear)) {
      setAcademicYear("");
    }
  }, [module]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const coursePattern = /^[A-Z]{2}\d{5}$/;
    if (!coursePattern.test(courseCode)) {
      setMessage(
        "Invalid course code. Use 2 letters followed by 5 digits (e.g. CS12345)."
      );
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);
    formData.append("branch", branch);
    formData.append("academicYear", academicYear);
    formData.append("year", year);
    formData.append("cycle", cycle);
    formData.append("semester", semester);
    formData.append("courseCode", courseCode);

    try {
      setMessage("Uploading file...");
      const response = await axios.post(
        // "https://qp-repository.onrender.com/api/upload",
        // "https://qp-repository-8vor.onrender.com/api/upload",
        "http://localhost:5000/api/upload",
        formData
      );
      setMessage(response.data.message);

      setModule("");
      setBranch("");
      setAcademicYear("");
      setYear("");
      setSemester("");
      setCycle("");
      setFile(null);
      setCourseCode("");
      setFileInputKey((prev) => prev + 1); // Add this line to force re-render of file input
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    }
  };

  // Add useEffect to handle message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 6000);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`fixed top-1 mt-8 text-center font-medium rounded-lg p-3 ${
            message.includes("failed")
              ? "text-red-200 bg-red-500"
              : "text-green-200 bg-green-500"
          }`}
        >
          {message}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-4xl bg-gradient-to-br from-green-700 via-green-600 to-green-500 backdrop-blur-lg rounded-xl p-8 shadow-xl"
      >
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          onSubmit={handleUpload}
        >
          <div>
            <label className="block font-medium text-green-100 mb-2">
              Module:
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={module}
              onChange={(e) => setModule(e.target.value)}
            >
              <option value="" className="text-gray-800">
                Select Module
              </option>
              <option value="Base" className="text-gray-800">
                Base
              </option>
              <option value="Bachelor" className="text-gray-800">
                Bachelor
              </option>
              <option value="Master" className="text-gray-800">
                Master
              </option>
            </select>
          </div>

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
              <option value="Agri" className="text-gray-800">
                Agriculture Engineering
              </option>
              <option value="CE" className="text-gray-800">
                Civil Engineering
              </option>
              <option value="CSE" className="text-gray-800">
                Computer Science & Engineering
              </option>
              <option value="EE" className="text-gray-800">
                Electrical Engineering
              </option>
              <option value="ECE" className="text-gray-800">
                Electronics & Communication Engineering
              </option>
              <option value="ME" className="text-gray-800">
                Mechanical Engineering
              </option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-green-100 mb-2">
              Year:
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" className="text-gray-800">
                Select Year
              </option>
              {years.map((yearOption) => (
                <option
                  key={yearOption}
                  value={yearOption}
                  className="text-gray-800"
                >
                  {yearOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-green-100 mb-2">
              Academic Year:
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              <option value="" className="text-gray-800">
                Select Academic Year
              </option>
              {academicOptions.map((opt) => (
                <option key={opt} value={opt} className="text-gray-800">
                  {opt}
                </option>
              ))}
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
              pattern="[A-Z]{2}[0-9]{5}"
              title="Two letters followed by five digits, no spaces (e.g. CS12345)"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-200/20 text-gray-100 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter course code (e.g. AB12345)"
            />
          </div>

          <div>
            <label className="block font-medium text-green-100 mb-2">
              File:
            </label>
            <div className="relative">
              <input
                key={fileInputKey} // Add this prop
                required
                type="file"
                accept=".pdf"
                className="w-full px-4 py-3 text-sm rounded-md bg-white/20 border border-green-200/20 text-gray-100 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
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
      </motion.div>
    </>
  );
};

export default UploadPage;
