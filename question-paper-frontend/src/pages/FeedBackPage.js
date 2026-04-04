import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Footer from "../components/Footer";

const FeedBackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("suggestion");
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
      setMessage("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col antialiased">
      {message && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-surface-container-high px-6 py-3 rounded shadow-lg border border-outline-variant/30 text-sm text-on-surface font-medium flex items-center gap-2">
            <span className={`material-symbols-outlined text-sm ${message.includes("Failed") ? "text-error" : "text-primary"}`}>
              {message.includes("Failed") ? "error" : "check_circle"}
            </span>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-32 pb-24 px-6 md:px-12 flex-grow max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Header Section */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <span className="text-primary tracking-widest font-semibold text-xs uppercase mb-4">Community Voices</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-on-surface leading-tight mb-8">
            Your Feedback <br/><span className="text-on-surface-variant">Matters</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            Help us refine the digital archive. Whether it's a bug report or a suggestion for a new feature, your input shapes the future of academic research.
          </p>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded bg-surface-container-high flex items-center justify-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary scale-75">lightbulb</span>
              </div>
              <div>
                <h4 className="font-medium text-on-surface">Feature Suggestions</h4>
                <p className="text-sm text-on-surface-variant">Tell us what tools you need for better studying.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded bg-surface-container-high flex items-center justify-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary scale-75">bug_report</span>
              </div>
              <div>
                <h4 className="font-medium text-on-surface">Bug Reporting</h4>
                <p className="text-sm text-on-surface-variant">Found a broken link or a typo? Let us know immediately.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-low p-8 md:p-12 border border-outline-variant/30 rounded-lg">
            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase" htmlFor="name">Name (Optional)</label>
                  <input 
                    className="bg-transparent border border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-outline" 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase" htmlFor="email">Email (Optional)</label>
                  <input 
                    className="bg-transparent border border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-outline" 
                    id="email" 
                    name="email" 
                    placeholder="john@example.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase" htmlFor="category">Category</label>
                <div className="relative">
                  <select 
                    className="w-full bg-transparent border border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:ring-0 transition-all appearance-none" 
                    id="category" 
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option className="bg-surface-container" value="suggestion">Suggestion</option>
                    <option className="bg-surface-container" value="bug">Bug</option>
                    <option className="bg-surface-container" value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase" htmlFor="message">Your Message *</label>
                <textarea 
                  className="bg-transparent border border-outline-variant/30 text-on-surface px-4 py-3 focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-outline resize-none" 
                  id="message" 
                  name="message" 
                  placeholder="Describe your experience or share your ideas..." 
                  rows="6"
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button 
                  disabled={isSubmitting || !feedback.trim()}
                  className={`group relative inline-flex items-center gap-3 bg-gradient-to-b from-primary to-primary-container text-on-primary font-semibold px-10 py-4 rounded-lg shadow-xl hover:translate-y-[-2px] transition-all active:translate-y-[0px] ${isSubmitting || !feedback.trim() ? "opacity-50 cursor-not-allowed grayscale" : ""}`} 
                  type="submit"
                >
                  <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
                  <span className={`material-symbols-outlined group-hover:translate-x-1 transition-transform ${isSubmitting ? "animate-spin" : ""}`}>
                    {isSubmitting ? "progress_activity" : "arrow_forward"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Subtle Social Proof / Info */}
          <div className="mt-8 flex flex-wrap gap-12 justify-center lg:justify-start opacity-40 uppercase tracking-widest font-bold text-[9px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">security</span>
              <span>Encrypted Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">history</span>
              <span>Response in 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Institutional Authority</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeedBackPage;
