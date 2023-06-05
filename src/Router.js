import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import UploadImage from './components/UploadImage';
import SearchImage from './components/Search_by_Tags';
// import your other components...

const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadImage />} />
            <Route path="/search_by_tag" element={<SearchImage />} />
        </Routes>
    </Router>
);

export default AppRouter;
