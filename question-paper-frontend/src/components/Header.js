import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-extrabold flex items-center gap-3">
          <img
            src="/logo.png"
            alt="QP Repository Logo"
            className="w-8 h-8 object-contain"
          />
          <Link to="/" className="hover:text-blue-200 ">
            QP Repository
          </Link>
        </h1>
        <nav>
          <ul className="flex gap-4 text-lg font-semibold">
            <li>
              <Link
                to="/"
                className="text-blue-300 hover:text-blue-200 transition-all underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/upload"
                className="text-green-300 hover:text-green-200 transition-all underline"
              >
                Upload
              </Link>
            </li>
            <li>
              <Link
                to="/download"
                className="text-red-300 hover:text-red-200 transition-all underline"
              >
                Download
              </Link>
            </li>
            <li>
              <Link
                to="/feedback"
                className="text-purple-300 hover:text-purple-200 transition-all underline"
              >
                Feedback
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
