import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import Footer from "../components/Footer";
import { FeedbackPageLoading } from "../components/loading/PageLoadingVariants";

const fadeTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: "easeOut" },
};

/**
 * Renders feedback submission UI for suggestions, bugs, and general comments.
 * @returns {JSX.Element} Feedback page UI.
 */
const FeedBackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * Sends feedback payload to the backend and resets form fields on success.
   * @param {React.FormEvent<HTMLFormElement>} e Submit event.
   * @returns {Promise<void>} Resolves when submission completes.
   */
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/feedback", {
        content: feedback,
        name,
        email,
        category,
      });

      setMessage(response.data.message || "Feedback submitted successfully!");
      setFeedback("");
      setName("");
      setEmail("");
      setCategory("suggestion");
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col pt-0 pb-0 overflow-hidden">
      {message && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 ${message.includes("Failed") ? "bg-error-container text-on-error-container border-error" : "bg-primary text-white border-primary/20"}`}
          >
            <span className="material-symbols-outlined">
              {message.includes("Failed") ? "error" : "verified"}
            </span>
            <span className="font-bold text-sm uppercase tracking-wider">
              {message}
            </span>
          </div>
        </div>
      )}

      <main className="flex-grow py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center space-y-4 mb-20">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-on-surface leading-none">
              Your Feedback
            </h1>
            <p className="text-on-surface-variant font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Help us refine the digital archive. Every insight drives our
              institutional progress.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="loading"
                {...fadeTransition}
                className="py-20 flex flex-col items-center justify-center"
              >
                <FeedbackPageLoading />
                <p className="mt-8 text-primary font-black uppercase tracking-widest text-xs animate-pulse">
                  Processing Insights...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                {...fadeTransition}
                className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start"
              >
                {/* Info Column */}
                <div className="md:col-span-5 space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold tracking-tight text-on-surface">
                      Community Voices
                    </h3>
                    <p className="text-on-surface-variant font-medium leading-relaxed">
                      Whether it's a bug report or a suggestion for a new
                      feature, your input shapes the future of academic
                      research.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          lightbulb
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider">
                          Feature Suggestions
                        </h4>
                        <p className="text-on-surface-variant text-sm mt-1">
                          Tell us what tools you need for better studying.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          bug_report
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-sm uppercase tracking-wider">
                          Bug Reporting
                        </h4>
                        <p className="text-on-surface-variant text-sm mt-1">
                          Found a broken link or a typo? Let us know
                          immediately.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-outline flex gap-8 opacity-40 grayscale">
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-xl">
                        security
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        Secure
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-xl">
                        history
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        Fast Response
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-xl">
                        verified_user
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        Institutional
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Column */}
                <form
                  onSubmit={handleFeedbackSubmit}
                  className="md:col-span-7 bg-surface-bright border border-outline rounded-3xl p-8 md:p-12 shadow-sm space-y-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., John Doe"
                        className="theme-input w-full"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="theme-input w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                      Classification
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="theme-input w-full appearance-none pr-10"
                      required
                    >
                      <option value="suggestion">💡 General Suggestion</option>
                      <option value="bug">🪲 Technical Bug</option>
                      <option value="other">💬 Other Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-[0.1em] font-black text-primary ml-1">
                      Your Insights *
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Describe your experience or share your ideas..."
                      rows="5"
                      className="theme-input w-full resize-none"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !feedback.trim()}
                      className="w-full btn-primary h-16 text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      <span className="material-symbols-outlined">send</span>
                      <span className="font-black uppercase tracking-widest text-sm">
                        Submit Insights
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedBackPage;
