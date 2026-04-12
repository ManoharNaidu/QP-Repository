import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import {
  BRANCH_OPTIONS,
  CYCLE_OPTIONS,
  MODULE_OPTIONS,
  SEMESTER_OPTIONS,
} from "../constants/questionPaper";
import Footer from "../components/Footer";
import { UploadPageLoading } from "../components/loading/PageLoadingVariants";

const BASE_ACADEMIC_OPTIONS = ["1st Year", "2nd Year"];
const BACHELOR_ACADEMIC_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

const fadeTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: "easeOut" },
};

/**
 * Renders the upload workflow for question paper metadata and PDF files.
 * @returns {JSX.Element} Upload page UI.
 */
const UploadPage = () => {
  const [formData, setFormData] = useState({
    module: "",
    branch: "",
    academicYear: "",
    year: "",
    semester: "",
    cycle: "",
    courseCode: "",
    file: null,
  });

  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const academicOptions =
    formData.module === "Bachelor"
      ? BACHELOR_ACADEMIC_OPTIONS
      : BASE_ACADEMIC_OPTIONS;

  /**
   * Updates a form field from standard input/select change events.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e Change event.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Captures a file selected via the hidden file input.
   * @param {React.ChangeEvent<HTMLInputElement>} e File input change event.
   * @returns {void}
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  /**
   * Validates and stores a selected PDF file in local component state.
   * @param {File} selectedFile Browser File object chosen by the user.
   * @returns {void}
   */
  const handleFileSelection = (selectedFile) => {
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Only PDF files are allowed.");
      return;
    }
    setFormData((prev) => ({ ...prev, file: selectedFile }));
  };

  /**
   * Submits upload metadata and file as multipart form data.
   * @param {React.FormEvent<HTMLFormElement>} e Form submit event.
   * @returns {Promise<void>} Resolves when submission lifecycle completes.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please select a file to upload.");
      return;
    }

    const coursePattern = /^[A-Z]{2}\d{5}$/;
    if (!coursePattern.test(formData.courseCode)) {
      alert("Invalid course code. Need 2 letters + 5 digits (e.g., CS12345)");
      return;
    }

    setIsUploading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await api.post("/api/upload", data);
      setMessage("Success! Your contribution has been archived.");
      setFormData({
        module: "",
        branch: "",
        academicYear: "",
        year: "",
        semester: "",
        cycle: "",
        courseCode: "",
        file: null,
      });
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please check your data and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col pt-0 pb-0 overflow-hidden">
      {message && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 ${message.includes("failed") ? "bg-error-container text-on-error-container border-error" : "bg-primary text-white border-primary/20"}`}
          >
            <span className="material-symbols-outlined">
              {message.includes("failed") ? "error" : "verified"}
            </span>
            <span className="font-bold text-sm uppercase tracking-wider">
              {message}
            </span>
          </div>
        </div>
      )}

      <main className="flex-grow py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center space-y-4 mb-20">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-on-surface leading-none">
              Upload Portal
            </h1>
            <p className="text-on-surface-variant font-medium text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              Join the institutional network of contributors by archiving
              high-quality digital examination assets.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="loading"
                {...fadeTransition}
                className="py-20 flex flex-col items-center justify-center"
              >
                <UploadPageLoading />
                <p className="mt-8 text-primary font-black uppercase tracking-widest text-xs animate-pulse">
                  Syncing with Archive...
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                {...fadeTransition}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20"
              >
                <div className="space-y-8">
                  {/* Subject/Course Code */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                      Archive ID (Course Code)
                    </label>
                    <input
                      type="text"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          courseCode: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="e.g., CS12345"
                      className="theme-input w-full"
                      required
                    />
                  </div>

                  {/* Branch & Module */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Discipline (Branch)
                      </label>
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="theme-input w-full appearance-none pr-10"
                        required
                      >
                        <option value="">Select Branch</option>
                        {BRANCH_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Stream (Module)
                      </label>
                      <select
                        name="module"
                        value={formData.module}
                        onChange={handleChange}
                        className="theme-input w-full"
                        required
                      >
                        <option value="">Select Module</option>
                        {MODULE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Year & Academic Year */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Base Year
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="theme-input w-full"
                        required
                      >
                        <option value="">Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Study Year
                      </label>
                      <select
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        className="theme-input w-full"
                        required
                      >
                        <option value="">Select</option>
                        {academicOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Exam Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Session (Cycle)
                      </label>
                      <select
                        name="cycle"
                        value={formData.cycle}
                        onChange={handleChange}
                        className="theme-input w-full"
                        required
                      >
                        <option value="">Cycle</option>
                        {CYCLE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Type (Semester)
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="theme-input w-full"
                        required
                      >
                        <option value="">Type</option>
                        {SEMESTER_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex-grow space-y-1.5 flex flex-col">
                    <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                      Asset Attachment (PDF Only)
                    </label>
                    <div
                      onDragEnter={() => setDragActive(true)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files[0])
                          handleFileSelection(e.dataTransfer.files[0]);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-grow relative flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-surface-bright transition-all p-12 cursor-pointer group ${dragActive ? "border-primary bg-primary/5" : "border-outline hover:border-primary/50"}`}
                    >
                      <input
                        key={fileInputKey}
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".pdf"
                      />
                      <div className="space-y-6 text-center">
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${formData.file ? "bg-primary text-white scale-110 shadow-xl shadow-primary/30" : "bg-primary/5 text-primary group-hover:scale-110"}`}
                        >
                          <span className="material-symbols-outlined text-4xl">
                            {formData.file ? "verified" : "upload_file"}
                          </span>
                        </div>
                        <div>
                          <p className="text-on-surface font-black text-lg max-w-[200px] truncate mx-auto">
                            {formData.file
                              ? formData.file.name
                              : "Drop selection here"}
                          </p>
                          <p className="text-on-surface-variant/60 text-xs mt-2 uppercase tracking-widest font-bold">
                            Max size 10MB • Institutional Verified
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full btn-primary h-20 text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <span className="material-symbols-outlined text-2xl">
                        publish
                      </span>
                      <span className="font-black uppercase tracking-widest">
                        Confirm Upload
                      </span>
                    </button>
                    <p className="text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] mt-8 opacity-40">
                      QP Repository • Institutional Infrastructure
                    </p>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;
