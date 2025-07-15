import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import Profile from './pages/Profile';
import FAQList from './pages/FAQList';
import AddFAQ from './pages/AddFAQ';
import NotFoundPage from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes without Header */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes with Header */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
         <Route path="/profile" element={<Profile />} />
          <Route path="/post" element={<AddFAQ />} />
          <Route path="/section/:category" element={<FAQList />} />
        </Route>
        
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
