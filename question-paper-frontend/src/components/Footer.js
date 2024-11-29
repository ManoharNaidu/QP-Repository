import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 shadow-inner relative">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} QP Repository. All rights reserved.
        </p>
        <p className="text-sm mt-1">
          Built with <span className="text-red-400">❤️</span> by Manohar Naidu
          Bheesetti.
        </p>
      </div>
      <a
        href="https://github.com/ManoharNaidu/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-5 right-8 text-white hover:text-gray-300 transition-all"
      >
        <FaGithub size={45} />
      </a>
    </footer>
  );
};

export default Footer;
