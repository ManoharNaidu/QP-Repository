import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { DownloadResultsLoading } from "../components/loading/PageLoadingVariants";

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

const fadeTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: "easeOut" },
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
    if (
      filters.academicYear &&
      !filteredAcademicYears.includes(filters.academicYear)
    ) {
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
    updateUrlWithFilters(defaultFilters, 1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateUrlWithFilters(filters, 1);
    }
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
    <div className="bg-background text-on-surface font-body min-h-screen relative flex flex-col pt-24 selection:bg-primary-container selection:text-on-primary-container antialiased">
      <main className="flex-grow py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface leading-none mb-4">
            Archive Explorer
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Navigate the institutional repository of digital examination assets.
            Optimized for speed and precision.
          </p>
        </header>

        {/* Search and Filter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-8 bg-surface-bright p-8 rounded-3xl border border-outline shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-primary">
                Refinement
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors"
              >
                Reset
              </button>
            </div>

            <form onSubmit={handleFilterSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                  Stream
                </label>
                <select
                  name="module"
                  value={filters.module}
                  onChange={handleInputChange}
                  className="theme-input w-full appearance-none pr-10 text-xs"
                >
                  <option value="">Any Module</option>
                  {MODULE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                  Discipline
                </label>
                <select
                  name="branch"
                  value={filters.branch}
                  onChange={handleInputChange}
                  className="theme-input w-full appearance-none pr-10 text-xs"
                >
                  <option value="">Any Branch</option>
                  {BRANCH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                    Type
                  </label>
                  <select
                    name="semester"
                    value={filters.semester}
                    onChange={handleInputChange}
                    className="theme-input w-full text-xs"
                  >
                    <option value="">Any</option>
                    {SEMESTER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                    Session
                  </label>
                  <select
                    name="cycle"
                    value={filters.cycle}
                    onChange={handleInputChange}
                    className="theme-input w-full text-xs"
                  >
                    <option value="">Any</option>
                    {CYCLE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                  Base Year
                </label>
                <select
                  name="year"
                  value={filters.year}
                  onChange={handleInputChange}
                  className="theme-input w-full text-xs"
                >
                  <option value="">Any Year</option>
                  {yearOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                  Study Year
                </label>
                <select
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleInputChange}
                  className="theme-input w-full text-xs"
                >
                  <option value="">Any Study Year</option>
                  {filteredAcademicYears.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary h-14 text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-lg">
                    {isLoading ? "sync" : "tune"}
                  </span>
                  Apply Filters
                </button>
              </div>
            </form>
          </aside>

          {/* Results Section */}
          <section
            className="lg:col-span-3 space-y-8"
            aria-busy={isLoading}
            aria-live="polite"
          >
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-primary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                name="courseCode"
                value={filters.courseCode}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyPress}
                className="w-full bg-surface-bright border border-outline text-on-surface pl-16 pr-6 h-16 rounded-2xl focus:border-primary focus:ring-1 focus:outline-none transition-all placeholder:text-on-surface-variant/40 font-medium text-lg"
                placeholder="Search Archive ID (e.g., CS101)..."
              />
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                <button
                  onClick={handleFilterSubmit}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:brightness-110"
                >
                  Execute
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" {...fadeTransition} className="py-12">
                  <DownloadResultsLoading />
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  {...fadeTransition}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-bold text-on-surface-variant">
                      Total Assets Identified:{" "}
                      <span className="text-primary font-black ml-1">
                        {totalItems}
                      </span>
                    </span>
                  </div>

                  {/* Papers Table */}
                  <div className="overflow-hidden bg-surface-bright rounded-3xl border border-outline shadow-sm">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                      <thead>
                        <tr className="bg-surface border-b border-outline">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                            Course Code
                          </th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                            Base Year
                          </th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                            Stream
                          </th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                            Classification
                          </th>
                          <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                            Retrieval
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline/50">
                        {papers.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                                <span className="material-symbols-outlined text-6xl">
                                  database_off
                                </span>
                                <p className="text-xl font-bold tracking-tight">
                                  System state: No matching assets
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          papers.map((paper, index) => (
                            <tr
                              key={paper._id || index}
                              className="hover:bg-primary/5 transition-colors group"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 shrink-0 bg-primary/5 text-primary flex items-center justify-center rounded-xl border border-primary/10">
                                    <span className="material-symbols-outlined text-lg">
                                      description
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-black text-on-surface tracking-tight">
                                      {paper.courseCode || "UNKN-001"}
                                    </p>
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                                      {paper.branch || "General Academic"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 font-mono text-sm font-bold text-on-surface-variant">
                                {paper.year}
                              </td>
                              <td className="px-8 py-6 text-sm font-bold text-on-surface-variant">
                                {paper.cycle || paper.semester}
                              </td>
                              <td className="px-8 py-6">
                                <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant border border-outline rounded-full text-[10px] font-black uppercase tracking-wider">
                                  {paper.module}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button
                                  onClick={() => downloadPaper(paper)}
                                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-surface border border-outline text-on-surface text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                                >
                                  <span className="material-symbols-outlined text-base">
                                    download
                                  </span>
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="flex items-center justify-between pt-8 px-2">
                      <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn-secondary flex items-center gap-2 h-12 px-6 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined text-lg">
                          arrow_back
                        </span>
                        <span className="text-xs uppercase tracking-widest font-black">
                          Previous
                        </span>
                      </button>
                      <div className="flex items-center gap-2">
                        {getPageNumbers().map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => changePage(pageNumber)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                              currentPage === pageNumber
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-on-surface-variant hover:bg-surface-bright border border-transparent hover:border-outline"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn-secondary flex items-center gap-2 h-12 px-6 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <span className="text-xs uppercase tracking-widest font-black">
                          Next
                        </span>
                        <span className="material-symbols-outlined text-lg">
                          arrow_forward
                        </span>
                      </button>
                    </nav>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DownloadPage;
