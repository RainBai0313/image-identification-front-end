import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import UploadImage from './components/UploadImage';
import SearchImage from './components/Search_by_Tags';
import SearchImageByImage from './components/Search_by_Images';
import EditTags from './components/EditTags';
// import your other components...

const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadImage />} />
            <Route path="/search_by_tag" element={<SearchImage />} />
            <Route path="/search_by_images" element={<SearchImageByImage />} />
            <Route path="/edit_tags" element={<EditTags />} />
        </Routes>
    </Router>
);

export default AppRouter;
