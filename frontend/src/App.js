import './App.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Homepage from './Homepage.js'

function App() {
  return (
    <Router>
    <div className="App">
      <Route exact path ='/' component={Homepage}></Route>
    </div>
    </Router>
  );
}

export default App;
