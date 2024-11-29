import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="text-center text-blue-900">
      <h1 className="text-4xl font-bold mb-8">Welcome! Choose Your Action</h1>
      <div className="flex justify-center items-center gap-4">
        <Link
          to="/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-lg transition-all transform hover:scale-105"
        >
          Upload Q Papers
        </Link>
        <span className="text-xl font-semibold">/</span>
        <Link
          to="/download"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-lg transition-all transform hover:scale-105"
        >
          Download Q Papers
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
