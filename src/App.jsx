import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SECTIONS } from "./constants/sections";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import FAQPage from "./pages/FAQPage";
import PostFAQ from "./pages/PostFAQ";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>FAQ Hub</h1>
          <p>Your comprehensive FAQ resource</p>
        </header>

        <Navigation />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {Object.entries(SECTIONS).map(([key, section]) => (
              <Route 
                key={key} 
                path={`/${key}`} 
                element={<FAQPage section={key} title={`${section.label} FAQs`} />} 
              />
            ))}
            <Route path="/post" element={<PostFAQ />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 FAQ Hub. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
