import React, { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { gsap } from "gsap";

const Footer = () => {
  const githubIconRef = useRef(null);

  useEffect(() => {
    // Create a pulsing animation for the GitHub icon
    gsap.to(githubIconRef.current, {
      scale: 1.5,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <footer className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 shadow-inner relative">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} QP Repository. All rights reserved.
        </p>
        <p className="text-sm mt-1">
          Built with <span className="text-red-400">❤️</span> by Manu.
        </p>
      </div>
      <a
        href="https://github.com/yourusername/yourrepository"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-5 right-8 text-white hover:text-gray-300 transition-all"
        ref={githubIconRef}
      >
        <FaGithub size={40} />
      </a>
    </footer>
  );
};

export default Footer;
