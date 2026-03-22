import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
    module === "Bachelor"
      ? ["1st Year", "2nd Year", "3rd Year", "4th Year"]
      : ["1st Year", "2nd Year"];

  useEffect(() => {
    if (academicYear && !academicOptions.includes(academicYear)) {
      setAcademicYear("");
    }
  }, [module]);

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
      const response = await axios.post(
        "https://qp-repository-8vor.onrender.com/api/upload",
        formData
      );
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

  // Drag and drop handlers
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
    
    // Check file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage("File size exceeds 10MB limit.");
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="text-[var(--text-primary)] font-body min-h-screen selection:bg-primary/30 relative flex flex-col">
      {/* Mesh Gradient Background */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
        style={{
          background: `
            radial-gradient(at 0% 0%, rgba(163, 166, 255, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(193, 128, 255, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(255, 109, 175, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(0, 255, 170, 0.05) 0px, transparent 50%)
          `
        }}
      ></div>

      {/* Background Accents */}
      <div className="fixed top-1/4 -right-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 -left-24 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-auto max-w-md"
          >
            <div className={`glass-card px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border ${
              message.includes("failed") || message.includes("Invalid") || message.includes("exceeds") || message.includes("Only PDF") || message.includes("Please select")
                ? "border-error/30 bg-error/10" 
                : "border-[#00ffaa]/30 bg-[#00ffaa]/10"
            }`}>
              <span className={`material-symbols-outlined ${
                message.includes("failed") || message.includes("Invalid") || message.includes("exceeds") || message.includes("Only PDF") || message.includes("Please select")
                  ? "text-error" 
                  : "text-[#00ffaa]"
              }`}>
                {message.includes("failed") || message.includes("Invalid") || message.includes("exceeds") || message.includes("Only PDF") || message.includes("Please select") 
                  ? "error" 
                  : message.includes("Uploading") ? "cloud_upload" : "check_circle"}
              </span>
              <p className="font-headline font-medium text-white text-sm">
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Canvas */}
      <main className="py-8 px-4 sm:px-6 max-w-5xl mx-auto w-full flex-grow relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-headline text-5xl font-extrabold tracking-tight mb-4 text-white">
            Submit <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Intellectual Assets</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            Contribution to the Luminous Archive ensures knowledge continuity. Upload academic assessments with precision metadata.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-[2.5rem]"></div>
          
          <form onSubmit={handleUpload} className="space-y-12 relative z-10">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              
              {/* Course Code */}
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-3 group-focus-within:text-primary transition-colors">Course Code</label>
                <div className="relative">
                  <input 
                    required
                    type="text"
                    pattern="[A-Z]{2}[0-9]{5}"
                    title="Two letters followed by five digits, no spaces (e.g. CS12345)"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 text-white py-3 px-3 transition-all placeholder:text-slate-600 font-body outline-none rounded-t" 
                    placeholder="e.g. CS12345" 
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-slate-500" data-icon="terminal">terminal</span>
                </div>
              </div>

              {/* Module Dropdown */}
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-3 group-focus-within:text-primary transition-colors">Module</label>
                <select 
                  required
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 text-white py-3 px-3 transition-all appearance-none outline-none cursor-pointer rounded-t"
                >
                  <option value="" disabled className="bg-[#0f1930]">Select Module</option>
                  <option value="Base" className="bg-[#0f1930]">Base</option>
                  <option value="Bachelor" className="bg-[#0f1930]">Bachelor</option>
                  <option value="Master" className="bg-[#0f1930]">Master</option>
                </select>
              </div>

              {/* Branch */}
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-3 group-focus-within:text-primary transition-colors">Branch</label>
                <select 
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 text-white py-3 px-3 transition-all appearance-none outline-none cursor-pointer rounded-t"
                >
                  <option value="" disabled className="bg-[#0f1930]">Select Discipline</option>
                  <option value="AE" className="bg-[#0f1930]">Agriculture Eng. (AE)</option>
                  <option value="CE" className="bg-[#0f1930]">Civil Eng. (CE)</option>
                  <option value="CSE" className="bg-[#0f1930]">Computer Science (CSE)</option>
                  <option value="EE" className="bg-[#0f1930]">Electrical Eng. (EE)</option>
                  <option value="ECE" className="bg-[#0f1930]">Electronics & Comm. (ECE)</option>
                  <option value="ME" className="bg-[#0f1930]">Mechanical Eng. (ME)</option>
                </select>
              </div>

              {/* Year */}
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-3 group-focus-within:text-primary transition-colors">Examination Year</label>
                <select 
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 text-white py-3 px-3 transition-all appearance-none outline-none cursor-pointer rounded-t"
                >
                  <option value="" disabled className="bg-[#0f1930]">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-[#0f1930]">{y}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-3 group-focus-within:text-primary transition-colors">Academic Year</label>
                <select 
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 text-white py-3 px-3 transition-all appearance-none outline-none cursor-pointer rounded-t"
                >
                  <option value="" disabled className="bg-[#0f1930]">Year of Study</option>
                  {academicOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0f1930]">{opt}</option>
                  ))}
                </select>
              </div>

              {/* Cycle */}
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-3 group-focus-within:text-primary transition-colors">Examination Cycle</label>
                <select 
                  required
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value)}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 text-white py-3 px-3 transition-all appearance-none outline-none cursor-pointer rounded-t"
                >
                  <option value="" disabled className="bg-[#0f1930]">Select Cycle</option>
                  <option value="Jan-Jun" className="bg-[#0f1930]">Jan-Jun (Even)</option>
                  <option value="Jul-Dec" className="bg-[#0f1930]">Jul-Dec (Odd)</option>
                </select>
              </div>

              {/* Semester */}
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-3 group-focus-within:text-primary transition-colors">Semester Type</label>
                <select 
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 text-white py-3 px-3 transition-all appearance-none outline-none cursor-pointer rounded-t"
                >
                  <option value="" disabled className="bg-[#0f1930]">Select Term Phase</option>
                  <option value="Mid" className="bg-[#0f1930]">Mid Semester</option>
                  <option value="End" className="bg-[#0f1930]">End Semester</option>
                </select>
              </div>

              {/* Empty Grid Slot for Alignment on desktop */}
              <div className="hidden md:block"></div>
            </div>

            {/* File Upload Area */}
            <div className="mt-8">
              <label className="block font-label text-xs uppercase tracking-widest text-slate-400 mb-6">Document Source (PDF ONLY)</label>
              
              <div 
                className={`relative w-full h-64 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                  dragActive 
                    ? "border-primary bg-primary/10 scale-[1.02]" 
                    : file 
                      ? "border-[#00ffaa]/40 bg-[#00ffaa]/5" 
                      : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input 
                  key={fileInputKey}
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div 
                      key="file-selected"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center text-center px-4"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00ffaa]/20 to-[#00ffaa]/5 flex items-center justify-center mb-4 border border-[#00ffaa]/30 shadow-[0_0_30px_rgba(0,255,170,0.1)]">
                        <span className="material-symbols-outlined text-[#00ffaa] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>task</span>
                      </div>
                      <p className="font-headline font-semibold text-white mb-2 max-w-xs truncate text-lg">
                        {file.name}
                      </p>
                      <p className="text-[#00ffaa] text-sm font-medium">
                        Ready to upload ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                      
                      <button 
                        type="button" 
                        onClick={removeSelectedFile}
                        className="mt-6 px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white font-label text-xs tracking-widest uppercase transition-colors"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="no-file"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center pointer-events-none"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 transition-transform">
                        <span className="material-symbols-outlined text-primary text-4xl" data-icon="cloud_upload">cloud_upload</span>
                      </div>
                      <p className="font-headline font-semibold text-white mb-2 text-lg">Drag and drop your PDF here</p>
                      <p className="text-slate-400 text-sm font-body">or click to browse local storage</p>
                      
                      <div className="mt-6 flex gap-3">
                        <span className="px-4 py-1.5 bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-label font-bold uppercase tracking-widest rounded-full">Max 10MB</span>
                        <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-label font-bold uppercase tracking-widest rounded-full">Secure Hash</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isUploading || !file}
                className={`w-full py-5 rounded-full font-headline font-extrabold text-lg flex items-center justify-center gap-3 transition-all ${
                  isUploading || !file
                    ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/5" 
                    : "bg-gradient-to-r from-primary to-primary-dim text-[#060e20] shadow-[0_15px_30px_rgba(163,166,255,0.25)] hover:shadow-[0_20px_40px_rgba(163,166,255,0.4)] active:scale-[0.98]"
                }`}
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" data-icon="publish">publish</span>
                    Upload Asset
                  </>
                )}
              </button>
              <p className="text-center text-slate-500 text-[10px] mt-6 uppercase tracking-[0.2em] font-label">Validated by Luminous Repository Protocols</p>
            </div>
          </form>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-nav)] mt-auto z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 py-6 sm:py-8">
          <div className="text-center sm:text-left">
            <span className="text-base font-bold text-[#a3a6ff] font-headline">QP-Repository</span>
            <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">© {new Date().getFullYear()} The Luminous Archive. All intellectual assets curated.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link className="text-[var(--text-muted)] hover:text-[#a3a6ff] transition-colors text-sm font-medium" to="/">Home</Link>
            <Link className="text-[var(--text-muted)] hover:text-[#a3a6ff] transition-colors text-sm font-medium" to="/feedback">Feedback</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage;
