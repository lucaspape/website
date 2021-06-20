import './App.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Homepage from './Homepage.js'
import Adminpage from './Adminpage.js'

function App() {
  return (
    <Router>
    <div className="App">
      <Route exact path ='/' component={Homepage}></Route>
      <Route exact path ='/admin' component={Adminpage}></Route>
    </div>
    </Router>
  );
}

export default App;
