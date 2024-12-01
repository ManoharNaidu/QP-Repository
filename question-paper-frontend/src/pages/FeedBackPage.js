import React, { useState } from "react";
import axios from "axios";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://qp-repository.onrender.com/api/feedback", {
        content: feedback,
      });

      setMessage(response.data.message);
      setFeedback("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to submit feedback.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-3/4">
      <h1 className="text-2xl font-bold mb-6">Feedback</h1>

      {/* Feedback Form */}
      <form onSubmit={handleFeedbackSubmit} className="mb-8">
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows="4"
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>

      {message && <p className="text-red-500 mb-4">{message}</p>}
    </div>
  );
};

export default FeedbackPage;
