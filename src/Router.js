// src/Router.js

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import UploadImage from './components/UploadImage';
// import your other components...

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/upload" component={UploadImage} />
      {/* Add your other routes here */}
    </Switch>
  </BrowserRouter>
);

export default Router;
