// src/Router.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import UploadImage from './components/UploadImage';
// import your other components...

const Router = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
        </Routes>
    </Router>
);

export default Router;
