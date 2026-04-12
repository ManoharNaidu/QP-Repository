import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

/**
 * Renders the main marketing and navigation landing page.
 * @returns {JSX.Element} Landing page UI.
 */
const LandingPage = () => {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container antialiased flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 md:px-12 pt-32 pb-16 lg:pt-24 lg:pb-16 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center text-center space-y-10">
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] text-on-surface">
                The institutional archive for{" "}
                <span className="text-primary italic">question papers.</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
                Connect with the largest student-powered repository of
                high-fidelity digital exams. Focused, minimalist, and built for
                speed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link
                to="/download"
                className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 hover:-translate-y-0.5 transition-all active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">search</span>
                Browse Papers
              </Link>
              <Link
                to="/upload"
                className="bg-surface border border-outline text-on-surface px-10 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-low transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">upload_file</span>
                Upload Portal
              </Link>
            </div>

            {/* Decorative Stats/Trust elements */}
            {/* <div className="pt-12 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black">5.2K+</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  Total Papers
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black">100%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  Verified PDFs
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black">6.4K+</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  Student Users
                </span>
              </div>
            </div> */}
          </div>
        </section>

        {/* Features Content Grid */}
        <section className="bg-surface-bright py-32 border-y border-outline">
          <div className="px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background p-10 rounded-2xl border border-outline hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">
                    bolt
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-4">
                  Instant Retrieval
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Advanced indexing allows you to filter through thousands of
                  years and branches in milliseconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background p-10 rounded-2xl border border-outline hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">
                    verified
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-4">
                  Quality Controlled
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Every paper undergoes human and algorithmic peer-review for
                  legibility and correct categorization.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background p-10 rounded-2xl border border-outline hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">
                    api
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-4">
                  Open Infrastructure
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Built for NERIST students with a secure, anonymous platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Engagement Section */}
        <section className="py-32 px-6 md:px-12">
          <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
            {/* Background decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
                Help expand our archive.
              </h2>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                The repository is built for students. Your contributions keep
                high-quality study materials free and accessible for everyone.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/upload"
                  className="bg-white text-primary px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Start Uploading Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
