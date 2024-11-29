import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DownloadPage from "./pages/DownloadPage";
import UploadPage from "./pages/UploadPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/download" element={<DownloadPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
