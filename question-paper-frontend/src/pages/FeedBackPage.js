import React, { useState, useEffect } from "react"; // Add useEffect import
import axios from "axios";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  // Add useEffect to handle message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        // "https://qp-repository.onrender.com/api/feedback",
        // "https://qp-repository-8vor.onrender.com/api/feedback",
        "http://localhost:5000/api/feedback",
        {
          content: feedback,
        }
      );

      setMessage(response.data.message);
      setFeedback("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit feedback.");
    }
  };

  return (
    <>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`fixed top-16 mt-6 text-center font-medium rounded-lg p-3 m-5 ${
            message.includes("Failed")
              ? "text-red-200 bg-red-500/10"
              : "text-purple-200 bg-purple-500/30"
          }`}
        >
          {message}
        </motion.p>
      )}
      {/* <div className="bg-gradient-to-br from-purple-800 via-purple-600 to-purple-500 p-4 rounded-xl"> */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative container mx-auto max-w-3xl bg-gradient-to-br from-purple-800 via-purple-700 to-purple-600  backdrop-blur-lg rounded-xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-200 text-center">
          Share Your Feedback
        </h1>

        <form onSubmit={handleFeedbackSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-purple-100 mb-3">
              We'd love to hear your thoughts!
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-purple-200/20 
                       text-gray-200 placeholder-purple-200 focus:outline-none focus:ring-2 
                       focus:ring-purple-400 min-h-[200px] resize-none"
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-white text-purple-600 font-semibold px-6 py-3 
                     rounded-lg shadow-lg hover:bg-purple-50 transition-colors"
          >
            Submit Feedback
          </motion.button>
        </form>

        <div className="mt-8 text-center text-purple-200/80 text-sm">
          Your feedback helps us improve our service for everyone.
        </div>
      </motion.div>
      {/* </div> */}

      <footer className="fixed bottom-4 right-4">
        <a
          href="https://github.com/ManoharNaidu/QP-Repository"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-200 hover:text-purple-300 transition-colors bg-gray-800/50 px-4 py-2 rounded-lg backdrop-blur-sm"
        >
          <svg
            className="h-8 w-8"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          View Project on GitHub
        </a>
      </footer>
    </>
  );
};

export default FeedbackPage;
