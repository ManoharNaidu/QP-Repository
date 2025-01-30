import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://qp-repository.onrender.com/api/feedback",
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
    <div className="bg-gradient-to-br from-purple-800 via-purple-600 to-purple-400 py-4 px-4 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-3xl bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          Share Your Feedback
        </h1>

        <form onSubmit={handleFeedbackSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-purple-100 mb-3">
              We'd love to hear your thoughts!
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-purple-200/20 
                       text-white placeholder-purple-200 focus:outline-none focus:ring-2 
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

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 text-center font-medium rounded-lg py-3 ${
              message.includes("Failed")
                ? "text-red-200 bg-red-500/20"
                : "text-green-200 bg-green-500/20"
            }`}
          >
            {message}
          </motion.p>
        )}

        <div className="mt-8 text-center text-purple-200/80 text-sm">
          Your feedback helps us improve our service for everyone.
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
