import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-extrabold">
          <Link to="/" className="hover:text-blue-300 transition-all">
            QP Repository
          </Link>
        </h1>
        <nav>
          <ul className="flex gap-4 text-lg font-semibold">
            <li>
              <Link to="/" className="hover:text-blue-300 transition-all">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/action?type=upload"
                className="hover:text-blue-300 transition-all"
              >
                Upload
              </Link>
            </li>
            <li>
              <Link
                to="/action?type=download"
                className="hover:text-blue-300 transition-all"
              >
                Download
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
