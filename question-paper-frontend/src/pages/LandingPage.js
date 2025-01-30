import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // You'll need to install framer-motion

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 flex flex-col justify-center items-center p-8 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 text-white">
          Welcome to QP-Repository
        </h1>

        <p className="text-blue-100 text-lg mb-12 max-w-2xl">
          Your one-stop destination for managing question papers.
          <br />
          Choose an option below to get started.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}>
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg shadow-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="text-lg font-semibold">Upload Papers</span>
          </Link>
        </motion.div>

        <div className="hidden md:block text-white text-2xl">or</div>

        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}>
          <Link
            to="/download"
            className="flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-lg shadow-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="text-lg font-semibold">Download Papers</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
