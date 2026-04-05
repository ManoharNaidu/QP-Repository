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
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.24, ease: "easeOut" },
};

const UploadPage = () => {
  const [module, setModule] = useState("");
  const [branch, setBranch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [cycle, setCycle] = useState("");
  const [file, setFile] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  
  const fileInputRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const yearStart = 2020;
  const years = Array.from(
    { length: currentYear - yearStart + 1 },
    (_, i) => currentYear - i
  );

  const academicOptions =
    module === "Bachelor" ? BACHELOR_ACADEMIC_OPTIONS : BASE_ACADEMIC_OPTIONS;

  useEffect(() => {
    if (academicYear && !academicOptions.includes(academicYear)) {
      setAcademicYear("");
    }
  }, [academicOptions, academicYear]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
    
    const coursePattern = /^[A-Z]{2}\d{5}$/;
    if (!coursePattern.test(courseCode)) {
      setMessage(
        "Invalid course code. Use 2 letters followed by 5 digits (e.g. CS12345)."
      );
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);
    formData.append("branch", branch);
    formData.append("academicYear", academicYear);
    formData.append("year", year);
    formData.append("cycle", cycle);
    formData.append("semester", semester);
    formData.append("courseCode", courseCode);

    try {
      setIsUploading(true);
      setMessage("Uploading file...");
      const response = await api.post("/api/upload", formData);
      setMessage(response.data.message || "Upload successful!");

      setModule("");
      setBranch("");
      setAcademicYear("");
      setYear("");
      setSemester("");
      setCycle("");
      setFile(null);
      setCourseCode("");
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleFileSelection = (selectedFile) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setMessage("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };
  
  const removeSelectedFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    setFileInputKey((prev) => prev + 1);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased">
      {message && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-surface-container-high px-6 py-3 rounded shadow-lg border border-outline-variant/30 text-sm text-on-surface font-medium flex items-center gap-2">
            <span className={`material-symbols-outlined text-sm ${message.includes("failed") || message.includes("Invalid") ? "text-error" : "text-primary"}`}>
              {message.includes("failed") || message.includes("Invalid") ? "error" : "check_circle"}
            </span>
            <span>{message}</span>
          </div>
        </div>
      )}

      <main className="flex-grow pt-32 pb-16 px-6 max-w-2xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Contribute to the Archive</h1>
          <p className="text-on-surface-variant font-body leading-relaxed">Help expand the QP Repository by adding high-quality question papers for the student community.</p>
        </header>

        <section aria-busy={isUploading} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {isUploading ? (
              <motion.div
                key="upload-loading"
                className="content-fade"
                {...fadeTransition}
              >
                <UploadPageLoading />
              </motion.div>
            ) : (
              <motion.form
                key="upload-form"
                onSubmit={handleUpload}
                className="space-y-6 content-fade"
                {...fadeTransition}
              >
            {/* Course Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Course Code</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface rounded-DEFAULT focus:border-primary focus:ring-1 focus:outline-none placeholder:text-outline transition-all" 
                placeholder="e.g. CS12345" 
                type="text"
                pattern="[A-Z]{2}[0-9]{5}"
                title="Use 2 letters followed by 5 digits (e.g. CS12345)"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            {/* Grid for small inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch */}
              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Branch</label>
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface rounded-DEFAULT focus:border-primary focus:ring-1 focus:outline-none transition-all appearance-none"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Branch</option>
                  {BRANCH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Module */}
              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Module</label>
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface rounded-DEFAULT focus:border-primary focus:ring-1 focus:outline-none transition-all appearance-none"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Module</option>
                  {MODULE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Year */}
              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Year</label>
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface rounded-DEFAULT focus:border-primary focus:ring-1 focus:outline-none transition-all appearance-none"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Academic Year</label>
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface rounded-DEFAULT focus:border-primary focus:ring-1 focus:outline-none transition-all appearance-none"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Year of Study</option>
                  {academicOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Semester</label>
                <select 
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface rounded-DEFAULT focus:border-primary focus:ring-1 focus:outline-none transition-all appearance-none"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Sem</option>
                  {SEMESTER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cycle */}
            <div className="space-y-2">
              <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Examination Cycle</label>
              <select 
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface rounded-DEFAULT focus:border-primary focus:ring-1 focus:outline-none transition-all appearance-none"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                required
              >
                <option value="" disabled>Select Exam Cycle</option>
                {CYCLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt} ({opt === "Jan-Jun" ? "Even" : "Odd"})</option>
                ))}
              </select>
            </div>

            {/* Upload Zone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium tracking-tight text-on-surface-variant uppercase text-[10px]">Document (PDF Only)</label>
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-outline-variant bg-surface-container-low p-12 text-center rounded-DEFAULT hover:border-primary transition-all cursor-pointer group ${dragActive ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <span className={`material-symbols-outlined text-4xl ${file ? 'text-primary' : 'text-outline-variant'} group-hover:text-primary transition-colors mb-4`}>
                    {file ? "check_circle" : "upload_file"}
                  </span>
                  <span className="text-on-surface font-medium mb-1">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </span>
                  <span className="text-xs text-on-surface-variant">Validated by Institutional Protocols (Max. 10MB)</span>
                  {file && (
                    <button type="button" onClick={removeSelectedFile} className="mt-4 text-xs text-error hover:underline uppercase tracking-widest font-bold">Remove File</button>
                  )}
                </div>
                <input 
                  key={fileInputKey}
                  ref={fileInputRef}
                  accept=".pdf" 
                  className="hidden" 
                  type="file" 
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button 
                disabled={!file}
                className={`w-full py-4 rounded-DEFAULT text-on-primary font-semibold tracking-tight shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${!file ? 'bg-surface-container text-outline cursor-not-allowed opacity-50' : 'bg-gradient-to-b from-primary to-primary-container hover:brightness-110'}`} 
                type="submit"
              >
                <><span className="material-symbols-outlined text-xl">cloud_upload</span> Upload Paper</>
              </button>
              <p className="text-center text-[9px] text-on-surface-variant mt-6 uppercase tracking-[0.2em] font-bold">Digital Archive • Institutional Authority • QP Repository</p>
            </div>
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UploadPage;
