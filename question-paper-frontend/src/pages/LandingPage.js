import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body antialiased">
      <main className="pt-16 md:pt-24 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start gap-12 lg:gap-24">
            <div className="flex-1 space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-on-surface">
                Access Past Question Papers Effortlessly. QP Repository.
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant font-light max-w-2xl leading-relaxed">
                A focused, minimalist archive for students to find, download, and contribute question papers. QP Repository provides high-fidelity digital scans.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/download"
                  className="bg-[linear-gradient(180deg,#4F46E5_0%,#3323cc_100%)] px-8 py-4 rounded-lg font-semibold text-white shadow-lg hover:brightness-110 transition-all scale-95 active:scale-100 flex items-center justify-center"
                >
                  Browse Papers
                </Link>
                <Link
                  to="/upload"
                  className="px-8 py-4 rounded-lg font-semibold border-2 border-primary text-primary hover:bg-surface-container transition-all scale-95 active:scale-100 flex items-center justify-center"
                >
                  Upload Paper
                </Link>
              </div>
            </div>

            {/* Asymmetric Decorative Element */}
            <div className="hidden lg:block w-1/3 relative">
              <div className="aspect-[3/4] bg-surface-container-low border border-outline-variant/30 p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-1 bg-primary"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-surface-container-highest rounded-full"></div>
                    <div className="h-2 w-3/4 bg-surface-container-highest rounded-full"></div>
                    <div className="h-2 w-5/6 bg-surface-container-highest rounded-full"></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-headline font-extrabold text-surface-container-highest">01</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 aspect-square w-32 bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-4xl">history_edu</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-surface-container-low py-24 border-y border-outline-variant/20">
          <div className="px-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-outline-variant/30">
              {/* Feature 1 */}
              <div className="p-12 border-r border-b md:border-b-0 border-outline-variant/30 space-y-6 hover:bg-surface-container transition-colors group">
                <div className="text-primary">
                  <span className="material-symbols-outlined text-4xl">search</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface">Fast Search</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">
                  Find exact papers in seconds with advanced filters for board, year, and subject expertise.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="p-12 border-r border-b md:border-b-0 border-outline-variant/30 space-y-6 hover:bg-surface-container transition-colors">
                <div className="text-primary">
                  <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface">Secure Uploads</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">
                  Anonymously contribute papers to the repository through a verified, secure peer-review process.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="p-12 border-r border-outline-variant/30 space-y-6 hover:bg-surface-container transition-colors">
                <div className="text-primary">
                  <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface">PDF Archive</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">
                  Access high-fidelity digital scans optimized for mobile reading and rapid printing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional CTA */}
        <section className="mb-32 px-8">
          <div className="max-w-4xl mx-auto border border-outline-variant/30 bg-surface-container-low py-20 px-8 text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tighter text-on-surface">Help Build the Repository</h2>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto font-light">
              QP Repository is powered by students. Your contributions ensure that high-quality study materials remain free and accessible to everyone.
            </p>
            <div className="flex justify-center">
              <Link to="/upload" className="px-12 py-4 border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all inline-block">
                Upload Your Papers
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
