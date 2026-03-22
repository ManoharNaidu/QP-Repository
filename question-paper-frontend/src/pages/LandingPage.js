import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlowingEffect } from '../components/ui/GlowingEffect';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
      {/* Mesh Gradient Background */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(at 0% 0%, rgba(163,166,255,0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(193,128,255,0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(255,109,175,0.08) 0px, transparent 50%)
          `,
        }}
      />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="mb-16 sm:mb-24">
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start lg:items-center justify-between">
            {/* Left */}
            <div className="lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
              >
                <span
                  className="material-symbols-outlined text-secondary text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <span className="font-label text-xs font-bold text-secondary tracking-widest uppercase">
                  The Digital Vault
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-headline text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter leading-[1.05] text-[var(--text-primary)] mb-6"
              >
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-tertiary">
                  QP-Repository
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-body text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-xl leading-relaxed mb-8"
              >
                The Luminous Archive of Academic Resources. Explore a curated collection of
                high-quality intellectual assets for modern learning.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/download"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold text-sm shadow-[0_0_20px_rgba(163,166,255,0.25)] hover:shadow-[0_0_32px_rgba(163,166,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Browse Archive
                </Link>
                <Link
                  to="/upload"
                  className="px-6 py-3 rounded-full border border-[var(--border-subtle)] bg-[var(--input-bg)] text-[var(--text-primary)] font-headline font-bold text-sm hover:border-primary/40 hover:bg-primary/10 active:scale-[0.98] transition-all"
                >
                  Upload Papers
                </Link>
              </motion.div>
            </div>

            {/* Right – decorative card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block relative lg:w-1/3 xl:w-2/5"
            >
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
              <div className="absolute top-20 right-20 w-48 h-48 bg-secondary/20 rounded-full blur-[60px]" />
              <div className="glass-card relative z-10 p-8 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="w-full h-48 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-2xl mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-white/50">school</span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-1/2 bg-primary/30 rounded-full" />
                  <div className="h-2 w-3/4 bg-[var(--border-subtle)] rounded-full" />
                  <div className="h-2 w-2/3 bg-[var(--border-subtle)] rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Link to="/upload" className="block h-full relative">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative h-full rounded-[2rem] border border-white/5"
            >
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="glass-card p-8 sm:p-10 rounded-[2rem] group hover:bg-[#192540]/60 hover:shadow-2xl transition-all duration-500 cursor-pointer h-full relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-lg border border-primary/20">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  </div>
                  <h3 className="font-headline text-2xl lg:text-3xl font-bold mb-3 text-[var(--text-primary)]">
                    Upload Papers
                  </h3>
                  <p className="font-body text-[var(--text-muted)] leading-relaxed text-sm lg:text-base mb-8">
                    Contribute to the collective intelligence. Securely submit past examination
                    papers and educational materials to our verified repository.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-label font-bold tracking-tight">
                    <span>Get Started</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to="/download" className="block h-full relative">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative h-full rounded-[2rem] border border-white/5"
            >
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="glass-card p-8 sm:p-10 rounded-[2rem] group hover:bg-[#192540]/60 hover:shadow-2xl transition-all duration-500 cursor-pointer h-full relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 shadow-lg border border-secondary/20">
                    <span className="material-symbols-outlined text-3xl">library_books</span>
                  </div>
                  <h3 className="font-headline text-2xl lg:text-3xl font-bold mb-3 text-[var(--text-primary)]">
                    Download Papers
                  </h3>
                  <p className="font-body text-[var(--text-muted)] leading-relaxed text-sm lg:text-base mb-8">
                    Access thousands of academic papers instantly. Search by subject code, year,
                    or difficulty level with our precision indexing.
                  </p>
                  <div className="flex items-center gap-2 text-secondary font-label font-bold tracking-tight">
                    <span>Browse Archive</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-nav)] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 py-6 sm:py-8">
          <div className="text-center sm:text-left">
            <span className="font-headline font-bold text-[#a3a6ff] text-base">QP-Repository</span>
            <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">
              © {new Date().getFullYear()} The Luminous Archive. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              to="/feedback"
              className="font-body text-xs text-[var(--text-muted)] hover:text-[#a3a6ff] transition-colors"
            >
              Feedback
            </Link>
            <a
              href="https://github.com/ManoharNaidu/QP-Repository"
              className="font-body text-xs text-[var(--text-muted)] hover:text-[#a3a6ff] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
