import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("User Interface");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Combine fields into content for the existing API
    const fullContent = `Name: ${name || 'Anonymous'}\nEmail: ${email || 'N/A'}\nCategory: ${category}\n\nMessage:\n${feedback}`;

    try {
      const response = await axios.post(
        "https://qp-repository-8vor.onrender.com/api/feedback",
        {
          content: fullContent,
        }
      );

      setMessage(response.data.message || "Feedback submitted successfully!");
      setFeedback("");
      setName("");
      setEmail("");
      setCategory("User Interface");
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["User Interface", "Data Accuracy", "Performance", "New Feature"];

  return (
    <div className="font-body text-[var(--text-primary)] min-h-screen flex flex-col selection:bg-primary/30 relative">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] font-medium rounded-xl px-6 py-4 shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
              message.includes("Failed")
                ? "text-red-200 bg-red-900/40 border-red-500/30"
                : "text-green-200 bg-green-900/40 border-green-500/30"
            }`}
          >
            <span className="material-symbols-outlined">
              {message.includes("Failed") ? "error" : "check_circle"}
            </span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>


      <main className="flex-grow py-10 px-4 sm:px-6 flex flex-col items-center justify-start relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-5xl relative z-10">
          <div className="mb-12 text-center md:text-left">
            <span className="font-label text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">Contributor Portal</span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Feedback</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 text-on-surface-variant text-lg max-w-2xl leading-relaxed mx-auto md:mx-0">
              Help us refine the digital architecture of our knowledge archive. Your insights drive the evolution of the QP-Repository.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-8 glass-card rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                    <input 
                      className="w-full bg-white/5 border-b-2 border-white/10 hover:border-white/20 focus:border-primary focus:ring-0 text-white px-4 py-3 rounded-t-lg transition-all placeholder:text-slate-500 font-body outline-none" 
                      placeholder="Enter your name" 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      className="w-full bg-white/5 border-b-2 border-white/10 hover:border-white/20 focus:border-primary focus:ring-0 text-white px-4 py-3 rounded-t-lg transition-all placeholder:text-slate-500 font-body outline-none" 
                      placeholder="email@example.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Feedback Category</label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {categories.map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          category === cat 
                            ? "border-primary/50 bg-primary/20 text-primary" 
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-slate-200"
                        }`} 
                        type="button"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-label text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Detailed Message <span className="text-red-400">*</span></label>
                  <textarea 
                    className="w-full bg-white/5 border-b-2 border-white/10 hover:border-white/20 focus:border-primary focus:ring-0 text-white px-4 py-3 rounded-t-lg transition-all placeholder:text-slate-500 font-body outline-none resize-none" 
                    placeholder="Write your feedback here..." 
                    rows="6"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <button 
                    disabled={isSubmitting || !feedback.trim()}
                    className="group relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-dim rounded-full text-on-primary font-bold shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:shadow-[0_0_30px_rgba(163,166,255,0.5)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none" 
                    type="submit"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
                    {isSubmitting ? (
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
            
            {/* Secondary Info Cards */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-4 flex flex-col gap-6">
              <div className="glass-card rounded-3xl p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary text-2xl">auto_awesome</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-white mb-3">Impact Score</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Your feedback directly influences our quarterly roadmap priorities. 85% of last month's updates were community-driven.</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center border border-secondary/20">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </div>
                  <div>
                    <div className="text-xs font-label text-slate-500 uppercase tracking-widest mb-1">Status</div>
                    <div className="text-sm font-bold text-white">Verified Contributor</div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-primary/5 to-transparent border-t border-l border-white/5">
                <h3 className="font-headline text-lg font-bold text-white mb-6">Other ways to connect</h3>
                <ul className="space-y-4">
                  <li>
                    <a className="flex items-center gap-4 group text-slate-400 hover:text-white transition-colors" href="https://github.com/ManoharNaidu/QP-Repository/issues" target="_blank" rel="noopener noreferrer">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-sm">bug_report</span>
                      </div>
                      <span className="text-sm font-medium">Report a Technical Bug</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex items-center gap-4 group text-slate-400 hover:text-white transition-colors" href="https://github.com/ManoharNaidu/QP-Repository" target="_blank" rel="noopener noreferrer">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-sm">code</span>
                      </div>
                      <span className="text-sm font-medium">View Source Code</span>
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-nav)] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-8 py-6 sm:py-8">
          <div className="text-center sm:text-left">
            <span className="text-base font-bold text-[#a3a6ff] font-headline">QP-Repository</span>
            <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">© {new Date().getFullYear()} The Luminous Archive. All intellectual assets curated.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link className="text-[var(--text-muted)] hover:text-[#a3a6ff] transition-colors text-sm font-medium" to="/">Home</Link>
            <Link className="text-[#c180ff] font-semibold transition-colors text-sm" to="/feedback">Feedback</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default FeedbackPage;
