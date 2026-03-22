import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingEffect } from "../components/ui/GlowingEffect";

const DownloadPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    module: "",
    branch: "",
    academicYear: "",
    year: "",
    semester: "",
    cycle: "",
    courseCode: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    module: "",
    branch: "",
    academicYear: "",
    year: "",
    semester: "",
    cycle: "",
    courseCode: "",
  });
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const papersPerPage = 10;

  // Dropdown options
  const branchOptions = ["AE", "CE", "CSE", "ECE", "EEE", "ME"];
  const moduleOptions = ["Base", "Bachelor", "Master"];
  const currentYear = new Date().getFullYear();
  const YearOptions = Array.from(
    { length: new Date().getFullYear() - 2020 + 1 },
    (_, i) => `${currentYear - i}`
  );
  const AcademicYearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const academicOptions =
    filters.module === "Base"
      ? AcademicYearOptions.slice(0, 2)
      : AcademicYearOptions;

  useEffect(() => {
    const urlFilters = {
      module: searchParams.get("module") || "",
      branch: searchParams.get("branch") || "",
      academicYear: searchParams.get("academicYear") || "",
      year: searchParams.get("year") || "",
      semester: searchParams.get("semester") || "",
      cycle: searchParams.get("cycle") || "",
      courseCode: searchParams.get("courseCode") || "",
    };
    setFilters(urlFilters);
    setAppliedFilters(urlFilters);
    fetchPapers(urlFilters);
  }, []);

  useEffect(() => {
    if (filters.academicYear && !academicOptions.includes(filters.academicYear)) {
      setFilters((prev) => ({ ...prev, academicYear: "" }));
    }
  }, [filters.module, filters.academicYear, academicOptions]);

  const semesterOptions = ["Mid", "End"];
  const cycleOptions = ["Jan-Jun", "Jul-Dec"];

  const fetchPapers = useCallback(
    async (filtersToFetch) => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://qp-repository-8vor.onrender.com/api/download",
          {
            params: filtersToFetch,
          }
        );
        setPapers(response.data.papers);
        setTotalPages(Math.max(1, Math.ceil(response.data.papers.length / papersPerPage)));
      } catch (error) {
        console.error("Error fetching papers:", error);
        setPapers([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [papersPerPage]
  );

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const updateUrlWithFilters = (filtersToUpdate) => {
    const params = new URLSearchParams();
    Object.keys(filtersToUpdate).forEach((key) => {
      if (filtersToUpdate[key]) {
        params.set(key, filtersToUpdate[key]);
      }
    });
    setSearchParams(params);
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setAppliedFilters(filters);
    updateUrlWithFilters(filters);
    fetchPapers(filters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      module: "",
      branch: "",
      academicYear: "",
      year: "",
      semester: "",
      cycle: "",
      courseCode: "",
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
    fetchPapers(defaultFilters);
  };

  const buildFileName = (paper) => {
    const parts = [
      paper.module,
      paper.branch,
      paper.year,
      paper.academicYear,
      paper.cycle,
      paper.semester,
      paper.courseCode,
    ].map((p) => (p ? String(p) : "unknown"));

    const base = parts.join("_").replace(/[^\w.-]+/g, "_");
    return `${base}.pdf`;
  };

  const downloadPaper = async (paper) => {
    try {
      const response = await axios.get(paper.fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: response.data.type || "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const filename = buildFileName(paper);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const paginateResults = () => {
    const startIndex = (currentPage - 1) * papersPerPage;
    const endIndex = startIndex + papersPerPage;
    return papers.slice(startIndex, endIndex);
  };

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate pagination buttons
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages, 3);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const displayedPapers = paginateResults();

  return (
    <div className="text-[var(--text-primary)] font-body min-h-screen flex flex-col selection:bg-primary/30 relative">

      {/* Ambient background glows */}
      <div className="fixed top-1/4 -left-96 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-96 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-grow py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="glass-card p-6 sm:p-8 rounded-3xl lg:sticky lg:top-24 shadow-xl"
          >
            <h2 className="font-headline font-extrabold text-xl mb-8 tracking-tight text-white">Filter Repository</h2>
            
            <form onSubmit={handleFilterSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">Course Code</label>
                <input 
                  type="text"
                  name="courseCode"
                  value={filters.courseCode}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none placeholder:text-slate-600 font-body" 
                  placeholder="e.g. PHY-402" 
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">Module</label>
                <select 
                  name="module"
                  value={filters.module}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">Any Module</option>
                  {moduleOptions.map((m, idx) => (
                    <option key={idx} value={m} className="bg-[#0f1930]">{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">Branch</label>
                <select 
                  name="branch"
                  value={filters.branch}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">Any Branch</option>
                  {branchOptions.map((b, idx) => (
                    <option key={idx} value={b} className="bg-[#0f1930]">{b}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">Exam Year</label>
                <select 
                  name="year"
                  value={filters.year}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">Any Year</option>
                  {YearOptions.map((y, idx) => (
                    <option key={idx} value={y} className="bg-[#0f1930]">{y}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">Academic Year</label>
                <select 
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">Any Academic Year</option>
                  {academicOptions.map((ay, idx) => (
                    <option key={idx} value={ay} className="bg-[#0f1930]">{ay}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-widest text-slate-400">Semester</label>
                  <select 
                    name="semester"
                    value={filters.semester}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-2 rounded-t outline-none font-body cursor-pointer appearance-none text-sm"
                  >
                    <option value="" className="bg-[#0f1930]">Any</option>
                    {semesterOptions.map((s, idx) => (
                      <option key={idx} value={s} className="bg-[#0f1930]">{s}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-widest text-slate-400">Cycle</label>
                  <select 
                    name="cycle"
                    value={filters.cycle}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-2 rounded-t outline-none font-body cursor-pointer appearance-none text-sm"
                  >
                    <option value="" className="bg-[#0f1930]">Any</option>
                    {cycleOptions.map((c, idx) => (
                      <option key={idx} value={c} className="bg-[#0f1930]">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-3">
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary-dim text-[#060e20] py-3 rounded-full font-bold font-headline transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">search</span>
                  )}
                  Apply Filters
                </button>
                <button 
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full border border-white/10 hover:bg-white/5 text-slate-300 py-3 rounded-full font-bold font-headline transition-all active:scale-95"
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.div>
        </aside>

        {/* Main Results Container */}
        <section className="flex-grow flex flex-col min-h-full">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4 mt-2">
            <div>
              <span className="font-label text-primary font-bold text-sm tracking-[0.2em] uppercase">Intellectual Assets</span>
              <h1 className="font-headline text-4xl font-extrabold tracking-tighter mt-2 text-white">Discovery Hub</h1>
            </div>
            <div className="text-slate-400 font-label text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
              Showing <span className="text-primary font-bold">{papers.length}</span> results
            </div>
          </div>

          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center opacity-60 h-64">
              <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4">progress_activity</span>
              <p className="font-headline">Searching Archive...</p>
            </div>
          ) : displayedPapers.length === 0 ? (
            <div className="flex-grow glass-card rounded-[2rem] p-12 flex flex-col items-center justify-center text-center opacity-80 h-64 border-dashed border-white/20 border-2 bg-transparent">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-6">search_off</span>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">No results found</h3>
              <p className="text-slate-400 font-body">Refine your filters to explore the repository.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-grow auto-rows-max">
              <AnimatePresence>
                {displayedPapers.map((paper, index) => (
                  <motion.div 
                    key={`${paper._id || index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative rounded-[2rem] border border-white/5"
                  >
                    <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                      borderWidth={2}
                    />
                    <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between group hover:bg-[#192540]/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label text-xs font-bold tracking-wider border border-primary/20">
                          {paper.courseCode || paper.branch || 'Unknown'}
                        </div>
                        <div className="text-slate-500 font-label text-xs font-bold bg-white/5 px-2 py-1 rounded border border-white/5 tracking-widest">{paper.year}</div>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="font-headline text-2xl font-bold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                          {paper.courseCode ? `Course: ${paper.courseCode}` : `${paper.branch} Paper`}
                        </h3>
                        <p className="text-slate-400 font-body text-sm leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
                          {paper.module && <span>{paper.module} &bull;</span>} 
                          {paper.academicYear && <span>{paper.academicYear} &bull;</span>}
                          {paper.semester && <span>Semester {paper.semester} &bull;</span>}
                          {paper.cycle && <span>{paper.cycle}</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a3a6ff]/20 to-[#c180ff]/20 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                          <span className="material-symbols-outlined text-primary text-xl">picture_as_pdf</span>
                        </div>
                        <span className="text-xs font-label text-slate-500 tracking-widest uppercase">Verified format</span>
                      </div>
                      
                      <button 
                        onClick={() => downloadPaper(paper)}
                        className="bg-white/5 hover:bg-gradient-to-r hover:from-primary hover:to-primary-dim p-3 rounded-full text-slate-300 hover:text-[#060e20] transition-all duration-300 shadow-lg active:scale-90"
                        title="Download Document"
                      >
                        <span className="material-symbols-outlined block" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
                      </button>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 mb-4 flex justify-center items-center gap-4">
              <button 
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 glass-card text-slate-300 hover:bg-primary/20 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              <div className="flex items-center glass-card rounded-full p-1.5 border border-white/10 gap-1">
                {getPageNumbers().map((num) => (
                  <button 
                    key={num}
                    onClick={() => changePage(num)}
                    className={`w-10 h-10 rounded-full font-bold font-headline text-sm transition-all ${
                      currentPage === num 
                        ? "bg-primary text-[#060e20] shadow-[0_0_15px_rgba(163,166,255,0.4)]" 
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                
                {totalPages > 3 && currentPage < totalPages - 1 && (
                  <>
                    <span className="w-6 flex items-center justify-center text-slate-600">...</span>
                    <button 
                      onClick={() => changePage(totalPages)}
                      className="w-10 h-10 rounded-full font-bold font-headline text-sm text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button 
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 glass-card text-slate-300 hover:bg-primary/20 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          )}
        </section>
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

export default DownloadPage;
