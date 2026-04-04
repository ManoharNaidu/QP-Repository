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
      <nav className={`fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-8 py-4 max-w-full font-body antialiased tracking-tight transition-shadow duration-300 ${scrolled ? "border-b border-outline-variant/20 shadow-sm" : ""}`}>
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-primary">
            <img src="/logo.png" alt="QP Repository Logo" className="w-8 h-8 object-contain" />
            <span>QP REPOSITORY</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  isActive(link.to)
                    ? "text-primary font-medium border-b-2 border-primary pb-1"
                    : "text-on-surface-variant font-normal hover:text-on-surface transition-colors pb-1"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:bg-surface-container transition-all duration-200 scale-95 active:scale-100 rounded-md flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <button 
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 md:hidden text-on-surface-variant hover:bg-surface-container transition-all flex items-center justify-center rounded-md">
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
