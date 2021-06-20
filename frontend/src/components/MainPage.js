import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import PageWrapper from './PageWrapper.js';

import HomePage from './pages/HomePage.js';
import AdminPage from './pages/AdminPage.js';
import GenericPage from './pages/GenericPage.js';

const axios = require('axios');

class MainPage extends Component {
  state = {
    updateRequired: true,
    pages: [],
    pageRoutes: []
  }

  render(){
    if(this.state.updateRequired){
      this.generatePages();

      this.setState({updateRequired: false});
    }

    return (
      <Router>
      <div className="App">
        {this.state.pageRoutes}
      </div>
      </Router>
    );
  }

  generatePages(){
    const pagesUrl = 'https://api.lucaspape.de/lucaspape/pages';

    axios.get(pagesUrl).then(({data}) => {
      const newPages = [];

      newPages.push({name: 'Home', uri: '/'});
      newPages.push({name: 'Admin', uri: '/admin'});

      data.results.forEach((page) => {
        newPages.push(page);
      });

      this.setState({pages:newPages});

      this.generateCustomPageRoutes();
    });
  }

  generateCustomPageRoutes(){
    const newPageRoutes = [];

    this.state.pages.forEach((page) => {
      if(page.name == 'Home'){
        newPageRoutes.push(<Route exact path = {page.uri} render={ (props) => <PageWrapper pages={this.state.pages} content={HomePage} {...props}/>}></Route>);
      }else if(page.name == 'Admin'){
        newPageRoutes.push(<Route exact path = {page.uri} render={ (props) => <PageWrapper pages={this.state.pages} content={AdminPage} {...props}/>}></Route>);
      }else{
        newPageRoutes.push(<Route exact path = {'/' + page.uri} render={ (props) => <PageWrapper pages={this.state.pages} id={page.id} name={page.name} content={GenericPage} {...props}/>}/>);
      }
    });

    this.setState({pageRoutes:newPageRoutes});
  }
}

export default MainPage;
