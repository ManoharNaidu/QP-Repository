import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DownloadPage from "./pages/DownloadPage";
import UploadPage from "./pages/UploadPage";
import FeedbackPage from "./pages/FeedBackPage";
import PredictPage from "./pages/PredictPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
