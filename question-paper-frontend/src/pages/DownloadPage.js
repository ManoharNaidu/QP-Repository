import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { GlowingEffect } from "../components/ui/GlowingEffect";
import { api } from "../lib/api";
import {
  BRANCH_OPTIONS,
  CYCLE_OPTIONS,
  MODULE_OPTIONS,
  PAPER_PAGE_SIZE,
  SEMESTER_OPTIONS,
} from "../constants/questionPaper";

const defaultFilters = {
  module: "",
  branch: "",
  academicYear: "",
  year: "",
  semester: "",
  cycle: "",
  courseCode: "",
};

const DownloadPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, index) => `${currentYear - index}`,
  );
  const academicYearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const filteredAcademicYears =
    filters.module === "Base"
      ? academicYearOptions.slice(0, 2)
      : academicYearOptions;

  const updateUrlWithFilters = useCallback(
    (filtersToUpdate, page = 1) => {
      const params = new URLSearchParams();

      Object.entries(filtersToUpdate).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      if (page > 1) {
        params.set("page", String(page));
      }

      setSearchParams(params);
    },
    [setSearchParams],
  );

  const fetchPapers = useCallback(async (filtersToFetch, pageToFetch = 1) => {
    setIsLoading(true);

    try {
      const response = await api.get("/api/download", {
        params: {
          ...filtersToFetch,
          page: pageToFetch,
          pageSize: PAPER_PAGE_SIZE,
        },
      });

      setPapers(response.data.papers || []);
      setCurrentPage(response.data.pagination?.page || pageToFetch);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalItems(response.data.pagination?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching papers:", error);
      setPapers([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const urlFilters = {
      module: searchParams.get("module") || "",
      branch: searchParams.get("branch") || "",
      academicYear: searchParams.get("academicYear") || "",
      year: searchParams.get("year") || "",
      semester: searchParams.get("semester") || "",
      cycle: searchParams.get("cycle") || "",
      courseCode: (searchParams.get("courseCode") || "").toUpperCase(),
    };
    const pageFromUrl = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10) || 1,
    );

    setFilters(urlFilters);
    setCurrentPage(pageFromUrl);
    fetchPapers(urlFilters, pageFromUrl);
  }, [fetchPapers, searchParams]);

  useEffect(() => {
    if (filters.academicYear && !filteredAcademicYears.includes(filters.academicYear)) {
      setFilters((previous) => ({
        ...previous,
        academicYear: "",
      }));
    }
  }, [filters.academicYear, filteredAcademicYears]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: name === "courseCode" ? value.toUpperCase() : value,
    }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    updateUrlWithFilters(filters, 1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
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
    ].map((part) => (part ? String(part) : "unknown"));

    return `${parts.join("_").replace(/[^\w.-]+/g, "_")}.pdf`;
  };

  const downloadPaper = async (paper) => {
    try {
      const response = await api.get(paper.fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: response.data.type || "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const filename = buildFileName(paper);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      updateUrlWithFilters(filters, pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages, 3);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className="text-[var(--text-primary)] font-body min-h-screen flex flex-col selection:bg-primary/30 relative">
      <div className="fixed top-1/4 -left-96 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-96 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-grow py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 relative z-10">
        <aside className="w-full md:w-80 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 sm:p-8 rounded-3xl lg:sticky lg:top-24 shadow-xl"
          >
            <h2 className="font-headline font-extrabold text-xl mb-8 tracking-tight text-white">
              Filter Repository
            </h2>

            <form onSubmit={handleFilterSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">
                  Course Code
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={filters.courseCode}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none placeholder:text-slate-600 font-body"
                  placeholder="e.g. CS12345"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">
                  Module
                </label>
                <select
                  name="module"
                  value={filters.module}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">
                    Any Module
                  </option>
                  {MODULE_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-[#0f1930]">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">
                  Branch
                </label>
                <select
                  name="branch"
                  value={filters.branch}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">
                    Any Branch
                  </option>
                  {BRANCH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#0f1930]">
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">
                  Exam Year
                </label>
                <select
                  name="year"
                  value={filters.year}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">
                    Any Year
                  </option>
                  {yearOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#0f1930]">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-slate-400">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0f1930]">
                    Any Academic Year
                  </option>
                  {filteredAcademicYears.map((option) => (
                    <option key={option} value={option} className="bg-[#0f1930]">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-widest text-slate-400">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={filters.semester}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-2 rounded-t outline-none font-body cursor-pointer appearance-none text-sm"
                  >
                    <option value="" className="bg-[#0f1930]">
                      Any
                    </option>
                    {SEMESTER_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-[#0f1930]">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-widest text-slate-400">
                    Cycle
                  </label>
                  <select
                    name="cycle"
                    value={filters.cycle}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-2 rounded-t outline-none font-body cursor-pointer appearance-none text-sm"
                  >
                    <option value="" className="bg-[#0f1930]">
                      Any
                    </option>
                    {CYCLE_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-[#0f1930]">
                        {option}
                      </option>
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

        <section className="flex-grow flex flex-col min-h-full">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4 mt-2">
            <div>
              <span className="font-label text-primary font-bold text-sm tracking-[0.2em] uppercase">
                Intellectual Assets
              </span>
              <h1 className="font-headline text-4xl font-extrabold tracking-tighter mt-2 text-white">
                Discovery Hub
              </h1>
            </div>
            <div className="text-slate-400 font-label text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
              Showing <span className="text-primary font-bold">{totalItems}</span> results
            </div>
          </div>

          {isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center opacity-60 h-64">
              <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4">
                progress_activity
              </span>
              <p className="font-headline">Searching Archive...</p>
            </div>
          ) : papers.length === 0 ? (
            <div className="flex-grow glass-card rounded-[2rem] p-12 flex flex-col items-center justify-center text-center opacity-80 h-64 border-dashed border-white/20 border-2 bg-transparent">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-6">
                search_off
              </span>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">
                No results found
              </h3>
              <p className="text-slate-400 font-body">
                Refine your filters to explore the repository.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-grow auto-rows-max">
              <AnimatePresence>
                {papers.map((paper, index) => (
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
                      glow
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                      borderWidth={2}
                    />
                    <div className="glass-card p-8 rounded-[2rem] flex flex-col justify-between group hover:bg-[#192540]/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label text-xs font-bold tracking-wider border border-primary/20">
                            {paper.courseCode || paper.branch || "Unknown"}
                          </div>
                          <div className="text-slate-500 font-label text-xs font-bold bg-white/5 px-2 py-1 rounded border border-white/5 tracking-widest">
                            {paper.year}
                          </div>
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
                            <span className="material-symbols-outlined text-primary text-xl">
                              picture_as_pdf
                            </span>
                          </div>
                          <span className="text-xs font-label text-slate-500 tracking-widest uppercase">
                            Verified format
                          </span>
                        </div>

                        <button
                          onClick={() => downloadPaper(paper)}
                          className="bg-white/5 hover:bg-gradient-to-r hover:from-primary hover:to-primary-dim p-3 rounded-full text-slate-300 hover:text-[#060e20] transition-all duration-300 shadow-lg active:scale-90"
                          title="Download Document"
                        >
                          <span
                            className="material-symbols-outlined block"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            download
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

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
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => changePage(pageNumber)}
                    className={`w-10 h-10 rounded-full font-bold font-headline text-sm transition-all ${
                      currentPage === pageNumber
                        ? "bg-primary text-[#060e20] shadow-[0_0_15px_rgba(163,166,255,0.4)]"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {totalPages > 3 && currentPage < totalPages - 1 && (
                  <>
                    <span className="w-6 flex items-center justify-center text-slate-600">
                      ...
                    </span>
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

      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-nav)] mt-auto z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 py-6 sm:py-8">
          <div className="text-center sm:text-left">
            <span className="text-base font-bold text-[#a3a6ff] font-headline">
              QP-Repository
            </span>
            <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">
              © {new Date().getFullYear()} The Luminous Archive. All intellectual assets
              curated.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              className="text-[var(--text-muted)] hover:text-[#a3a6ff] transition-colors text-sm font-medium"
              to="/"
            >
              Home
            </Link>
            <Link
              className="text-[var(--text-muted)] hover:text-[#a3a6ff] transition-colors text-sm font-medium"
              to="/feedback"
            >
              Feedback
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default DownloadPage;
