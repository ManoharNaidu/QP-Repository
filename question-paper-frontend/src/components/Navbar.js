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

  // Close menu on route change
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
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 glass-nav h-16 md:h-20 flex items-center transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_32px_rgba(0,0,0,0.3)]" : ""
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-black font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#a3a6ff] to-[#c180ff] flex-shrink-0"
          >
            QP-Repository
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-full font-headline font-bold text-sm transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-[#a3a6ff] bg-[#a3a6ff]/10 border border-[#a3a6ff]/30"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--input-bg)] hover:bg-[#a3a6ff]/15 hover:border-[#a3a6ff]/40 transition-all duration-200 group"
            >
              <motion.span
                key={isDark ? "moon" : "sun"}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="material-symbols-outlined text-base md:text-lg text-[var(--text-muted)] group-hover:text-[#a3a6ff] transition-colors"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isDark ? "light_mode" : "dark_mode"}
              </motion.span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
              className="md:hidden w-9 h-9 rounded-full flex flex-col items-center justify-center gap-1.5 border border-[var(--border-subtle)] bg-[var(--input-bg)] hover:bg-white/10 transition-all"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-4 h-0.5 bg-[var(--text-primary)]"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="block w-4 h-0.5 bg-[var(--text-primary)]"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-4 h-0.5 bg-[var(--text-primary)]"
              />
            </button>
          </div>
        </div>
      </header>

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
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 glass-card md:hidden flex flex-col pt-24 pb-8 px-6 gap-2 shadow-2xl"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border-subtle)] hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-lg text-[var(--text-muted)]">close</span>
              </button>

              <p className="font-label text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4 ml-1">Navigation</p>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl font-headline font-bold text-base transition-all ${
                    isActive(link.to)
                      ? "text-[#a3a6ff] bg-[#a3a6ff]/10 border border-[#a3a6ff]/20"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-auto border-t border-[var(--border-subtle)] pt-6">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--input-bg)] hover:bg-white/10 transition-all"
                >
                  <span
                    className="material-symbols-outlined text-[#a3a6ff]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isDark ? "light_mode" : "dark_mode"}
                  </span>
                  <span className="font-headline font-bold text-sm text-[var(--text-primary)]">
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
