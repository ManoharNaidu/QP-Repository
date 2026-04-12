import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Renders AI-assisted prediction UI for likely exam questions by course code.
 * @returns {JSX.Element} Prediction page UI.
 */
const PredictPage = () => {
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  /**
   * Requests prediction data from the backend for the current course code.
   * @param {React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>} e Trigger event.
   * @returns {Promise<void>} Resolves when request lifecycle completes.
   */
  const handlePredict = async (e) => {
    e.preventDefault();
    if (!courseCode) return;

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/predict/${courseCode.toUpperCase()}`,
      );
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate prediction. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body antialiased py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
          >
            AI Question <span className="text-primary italic">Predictor.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-on-surface-variant max-w-2xl mx-auto"
          >
            Enter a course code to analyze historical paper patterns and predict
            high-probability questions for your next exam.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-outline p-2 rounded-2xl shadow-xl flex items-center gap-2 max-w-lg mx-auto focus-within:border-primary/50 transition-all"
        >
          <input
            type="text"
            placeholder="Search Course Code (e.g., PH11001)"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="flex-grow bg-transparent border-none focus:ring-0 px-4 py-3 text-lg font-bold uppercase placeholder:normal-case"
          />
          <button
            onClick={handlePredict}
            disabled={loading || !courseCode}
            className="bg-primary text-white p-3 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 min-w-[120px]"
          >
            {loading ? (
              <span className="animate-spin material-symbols-outlined">
                sync
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>Analyze</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-24"
          >
            {/* Summary */}
            <div className="bg-primary/5 border border-primary/10 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                Analysis Summary
              </h3>
              <p className="text-on-surface leading-relaxed italic">
                "{prediction.analysisSummary}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Frequent Topics */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    analytics
                  </span>
                  Core Topics
                </h3>
                <div className="space-y-4">
                  {prediction.frequentTopics.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-surface border border-outline p-6 rounded-2xl hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold">{item.topic}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            item.importance === "High"
                              ? "bg-error-container text-on-error-container"
                              : item.importance === "Medium"
                                ? "bg-warning-container text-on-warning-container"
                                : "bg-primary-container text-on-primary-container"
                          }`}
                        >
                          {item.importance} Priority
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm italic">
                        "{item.reason}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predicted Questions */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    psychology
                  </span>
                  Predicted Questions
                </h3>
                <div className="space-y-4">
                  {prediction.predictedQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-surface border border-outline p-6 rounded-2xl border-l-4 border-l-primary hover:shadow-lg transition-all"
                    >
                      <p className="text-lg font-medium mb-3 leading-relaxed">
                        {item.question}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container rounded-lg p-2">
                        <span className="material-symbols-outlined text-sm">
                          trending_up
                        </span>
                        Probability: {item.probability}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-surface border border-outline p-10 rounded-3xl space-y-6">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  lightbulb
                </span>
                Study Strategy
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prediction.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex gap-4 items-start p-4 bg-background rounded-xl border border-outline/50"
                  >
                    <span className="text-primary font-bold">{idx + 1}.</span>
                    <span className="text-on-surface-variant leading-relaxed">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!prediction && !loading && !error && (
          <div className="text-center py-20 opacity-30 grayscale pointer-events-none">
            <span className="material-symbols-outlined text-9xl mb-4">
              data_exploration
            </span>
            <p className="text-xl font-bold">
              Awaiting historical data analysis...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictPage;
