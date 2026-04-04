import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const modalContent = {
  terms: {
    title: "Terms of Service",
    body: "These Terms of Service govern your use of the QP Repository. By accessing the repository, you agree to abide by institutional guidelines regarding the sharing and consumption of intellectual assets. Users are strictly prohibited from submitting copyrighted materials they do not own.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "Your privacy is paramount. QP Repository collects minimal telemetry to ensure platform stability. Uploaded documents are stripped of personal identifers where algorithmic scrubbing is applicable. We do not sell or share contributor metadata with third parties.",
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
      <footer className="w-full py-12 mt-auto border-t border-outline-variant/30 bg-surface-dim">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto gap-6 md:gap-0">
          <span className="text-sm font-body text-on-surface-variant">
            © {new Date().getFullYear()} QP Repository. Institutional Authority.
          </span>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveModal("terms")}
              className="text-sm font-body text-on-surface-variant hover:text-on-surface hover:underline transition-all"
            >
              Terms
            </button>
            <button
              onClick={() => setActiveModal("privacy")}
              className="text-sm font-body text-on-surface-variant hover:text-on-surface hover:underline transition-all"
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveModal("rules")}
              className="text-sm font-body text-on-surface-variant hover:text-on-surface hover:underline transition-all"
            >
              Archive Rules
            </button>
          </div>
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
              className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-surface-container-high border border-outline-variant/30 rounded-xl shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold font-headline text-on-surface">
                  {modalContent[activeModal].title}
                </h3>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-bright text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-on-surface-variant leading-relaxed font-body">
                  {modalContent[activeModal].body}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-primary-container text-on-primary-container font-medium rounded hover:brightness-110 transition-all font-body text-sm"
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
