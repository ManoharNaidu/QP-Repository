import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/",         label: "Home" },
    { to: "/download", label: "Archive" },
    { to: "/upload",   label: "Upload" },
    { to: "/feedback", label: "Feedback" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-background flex items-center justify-between px-6 md:px-12 py-4 tracking-tight transition-all duration-300 ${scrolled ? "border-b border-outline shadow-sm" : ""}`}>
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tighter text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <span className="hidden sm:inline">QP Repository</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-all hover:text-primary ${
                  isActive(link.to)
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-on-surface-variant"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-primary rounded-full transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <button 
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>


      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-surface/80 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface-container-low border-l border-outline-variant/30 md:hidden flex flex-col pt-24 pb-8 px-6 gap-2"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-md flex items-center justify-center border border-outline-variant/30 hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-lg text-on-surface-variant">close</span>
              </button>

              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Navigation</p>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-md font-semibold text-base transition-all ${
                    isActive(link.to)
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-auto border-t border-outline-variant/30 pt-6">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-md border border-outline-variant/30 bg-transparent hover:bg-surface-container-high transition-all"
                >
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isDark ? "light_mode" : "dark_mode"}
                  </span>
                  <span className="font-semibold text-sm text-on-surface">
                    {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
