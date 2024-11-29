import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ActionPage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const type = queryParams.get("type"); // "upload" or "download"
  const [isUpload, setIsUpload] = useState(true);

  useEffect(() => {
    setIsUpload(type === "upload");
  }, [type]);

  // Generate years dynamically from 2015 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2015 + 1 },
    (_, i) => 2015 + i
  );

  return (
    <div className="text-center text-blue-900">
      <h1 className="text-4xl font-bold mb-8">
        {isUpload ? "Upload Q Papers" : "Download Q Papers"}
      </h1>

      <div
        className={`p-6 rounded-lg shadow-lg ${
          isUpload ? "bg-blue-100" : "bg-green-100"
        }`}
      >
        <form className="space-y-4">
          {/* Branch Dropdown */}
          <select
            className="border border-gray-400 p-2 rounded-md w-full"
            required
          >
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science Engineering</option>
            <option value="ECE">Electronics & Communication Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
            <option value="EEE">Electrical & Electronics Engineering</option>
          </select>

          {/* Year Dropdown */}
          <select
            className="border border-gray-400 p-2 rounded-md w-full"
            required
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Semester Dropdown */}
          <select
            className="border border-gray-400 p-2 rounded-md w-full"
            required
          >
            <option value="">Select Semester</option>
            <option value="mid">Mid Semester</option>
            <option value="end">End Semester</option>
          </select>

          {/* Cycle Dropdown */}
          <select
            className="border border-gray-400 p-2 rounded-md w-full"
            required
          >
            <option value="">Select Cycle</option>
            <option value="Jan-Jun">January - June</option>
            <option value="July-Dec">July - December</option>
          </select>

          {isUpload ? (
            <>
              {/* File Upload for Upload Action */}
              <div className="mb-4">
                <input
                  type="file"
                  accept=".pdf"
                  className="border border-gray-400 p-2 rounded-md w-full"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  * Only PDF files are allowed.
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg transition-all transform hover:scale-105"
              >
                Upload
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-lg transition-all transform hover:scale-105"
            >
              Download
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ActionPage;
