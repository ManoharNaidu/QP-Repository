import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";

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
    updateUrlWithFilters(defaultFilters, 1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
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
    <div className="text-on-surface font-body min-h-screen relative flex flex-col antialiased">
      <main className="flex-grow pt-8 pb-12 px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <header className="mb-12 mt-12 md:mt-20">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">
            Browse &amp; Search Repository
          </h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            Access the institutional archive of examination papers. Filter by
            academic module, branch, and period to find specific materials.
          </p>
        </header>

        {/* Search and Filter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-8 bg-surface-container-low p-6 rounded-lg border border-outline-variant/30">
            <form onSubmit={handleFilterSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                  Module
                </label>
                <select
                  name="module"
                  value={filters.module}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded text-sm focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                >
                  <option value="">Any Module</option>
                  {MODULE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                  Branch
                </label>
                <select
                  name="branch"
                  value={filters.branch}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded text-sm focus:border-primary focus:ring-1 focus:outline-none transition-colors"
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
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={filters.semester}
                    onChange={handleInputChange}
                    className="w-full bg-surface border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded text-sm focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                  >
                    <option value="">Any</option>
                    {SEMESTER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    Cycle
                  </label>
                  <select
                    name="cycle"
                    value={filters.cycle}
                    onChange={handleInputChange}
                    className="w-full bg-surface border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded text-sm focus:border-primary focus:ring-1 focus:outline-none transition-colors"
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                  Exam Year
                </label>
                <select
                  name="year"
                  value={filters.year}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded text-sm focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                >
                  <option value="">Any Year</option>
                  {yearOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleInputChange}
                  className="w-full bg-surface border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded text-sm focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                >
                  <option value="">Any Academic Year</option>
                  {filteredAcademicYears.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary-container text-on-primary-container font-medium rounded hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isLoading ? "refresh" : "filter_alt"}
                  </span>
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  disabled={isLoading}
                  className="w-full py-3 border border-outline-variant/30 text-on-surface font-medium rounded hover:bg-surface-container-high transition-all"
                >
                  Reset
                </button>
              </div>
            </form>
          </aside>

          {/* Results Section */}
          <section className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant">
                  search
                </span>
              </div>
              <input
                type="text"
                name="courseCode"
                value={filters.courseCode}
                onChange={handleInputChange}
                onKeyDown={handleSearchKeyPress}
                className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface pl-12 pr-4 py-4 rounded-lg focus:border-primary focus:ring-1 focus:outline-none transition-all placeholder:text-outline"
                placeholder="Search by course code (e.g. CS101)..."
              />
            </div>
            
            <div className="text-sm text-on-surface-variant">Showing <span className="font-semibold text-primary">{totalItems}</span> results</div>

            {/* Papers List Table-style */}
            <div className="overflow-x-auto bg-surface-container-low rounded-lg border border-outline-variant/30">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant/30">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Course / Paper
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Year
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Cycle
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Semester
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {papers.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">search_off</span>
                          <span className="text-on-surface">No papers found</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {papers.map((paper, index) => (
                    <tr
                      key={paper._id || index}
                      className="hover:bg-surface-bright transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-10 shrink-0 bg-surface-container-highest flex items-center justify-center rounded border border-outline-variant/20">
                            <span className="material-symbols-outlined text-sm text-primary">
                              description
                            </span>
                          </div>
                          <span className="font-medium text-on-surface truncate max-w-[200px]" title={paper.courseCode || paper.branch || "Unknown"}>
                            {paper.courseCode || paper.branch || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant font-mono text-sm">
                        {paper.year}
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant text-sm">
                        {paper.cycle || "-"}
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant text-sm">
                        {paper.semester || "-"}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => downloadPaper(paper)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary text-xs font-medium rounded hover:bg-primary hover:text-on-primary transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">
                            download
                          </span>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-between border-t border-outline-variant/20 pt-8">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface text-sm font-medium rounded hover:bg-surface-container-high transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_back
                  </span>
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {getPageNumbers().map((pageNumber) => (
                    <span
                      key={pageNumber}
                      onClick={() => changePage(pageNumber)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm cursor-pointer transition-colors ${
                        currentPage === pageNumber
                          ? "bg-primary text-on-primary font-medium"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {pageNumber}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface text-sm font-medium rounded hover:bg-surface-container-high transition-colors disabled:opacity-50"
                >
                  Next
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </nav>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DownloadPage;
