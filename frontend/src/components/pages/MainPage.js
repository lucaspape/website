import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import HomePage from './HomePage.js';
import AdminPage from './AdminPage.js';
import GenericPage from './GenericPage.js';

const axios = require('axios');

class MainPage extends Component {
  state = {
    pageRoutes: [],
    updateRequired: true
  }

  render(){
    if(this.state.updateRequired){
      this.generateCustomPageRoutes();

      this.setState({updateRequired: false});
    }

    return (
      <Router>
      <div className="App">
        <Route exact path ='/' component={HomePage}></Route>
        <Route exact path ='/admin' component={AdminPage}></Route>

        {this.state.pageRoutes}
      </div>
      </Router>
    );
  }

  generateCustomPageRoutes(){
    const pagesUrl = 'https://api.lucaspape.de/lucaspape/pages';

    axios.get(pagesUrl).then(({data}) => {
      const newPages = [];

      data.results.forEach((page) => {
        newPages.push(<Route exact path = {'/' + page.uri} render={ (probs) => <GenericPage id={page.id} name={page.name} {...probs}/> }></Route>);
      });

      this.setState({pageRoutes: newPages});
    });
  }
}

export default MainPage;
