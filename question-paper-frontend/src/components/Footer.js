import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalContent = {
  terms: {
    title: "Terms of Service",
    body: "These Terms of Service govern your use of the QP Repository. By accessing the repository, you agree to abide by institutional guidelines regarding the sharing and consumption of intellectual assets. Users are strictly prohibited from submitting copyrighted materials they do not own.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "Your privacy is paramount. QP Repository collects minimal telemetry to ensure platform stability. Uploaded documents are stripped of personal identifiers where algorithmic scrubbing is applicable. We do not sell or share contributor metadata with third parties.",
  },
  rules: {
    title: "Archive Rules",
    body: "1. All submissions must be PDF format. 2. Ensure documents are legible and correctly categorized. 3. Do not upload duplicate papers. 4. Spam or maliciously structured files will trigger an immediate IP ban. 5. Peer review is mandatory for all new assets before public availability.",
  },
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="w-full py-10 mt-auto border-t border-outline bg-surface-bright">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-6 md:gap-0">
          {/* Logo and GitHub Link */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-bold opacity-80">
              <span className="material-symbols-outlined text-xl">school</span>
              <span className="text-sm">QP Repository</span>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1px] h-4 bg-outline" />

            <a
              href="https://github.com/ManoharNaidu/QP-Repository"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors group"
              title="View on GitHub"
            >
              {/* Using a custom SVG for the GitHub icon or a Material Symbol */}
              <svg
                height="20"
                width="20"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                Source
              </span>
            </a>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveModal("terms")}
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-all uppercase tracking-wider"
            >
              Terms
            </button>
            <button
              onClick={() => setActiveModal("privacy")}
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-all uppercase tracking-wider"
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveModal("rules")}
              className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-all uppercase tracking-wider"
            >
              Archive Rules
            </button>
          </div>

          <span className="text-xs font-medium text-on-surface-variant/60">
            © {new Date().getFullYear()} Institutional Authority.
          </span>
        </div>
      </footer>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-on-background/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-background border border-outline rounded-2xl shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-on-surface tracking-tight">
                  {modalContent[activeModal].title}
                </h3>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    close
                  </span>
                </button>
              </div>
              <div className="max-w-none">
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  {modalContent[activeModal].body}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-outline flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all text-sm shadow-lg shadow-primary/20"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
