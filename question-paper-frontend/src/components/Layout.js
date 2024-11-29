import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { gsap } from "gsap";

const Layout = () => {
  useEffect(() => {
    // Smooth animations for floating shapes
    gsap.to(".shape", {
      y: "+=20",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-gradient-to-br from-blue-300 via-blue-200 to-blue-500">
      {/* Floating Shapes for Theme */}
      <div className="shape absolute bg-white opacity-40 rounded-full w-32 h-32 top-10 left-20"></div>
      <div className="shape absolute bg-white opacity-40 rounded-full w-48 h-48 bottom-20 right-20"></div>
      <div className="shape absolute bg-white opacity-20 rounded-lg w-40 h-40 top-40 right-32"></div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
