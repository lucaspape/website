import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import PageWrapper from './PageWrapper.js';

import AdminPage from './pages/admin/AdminPage.js';
import DesignPage from './pages/admin/DesignPage.js';
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
    const getCdnProxyUrl = 'https://cdn.lucaspape.de/proxy';

    axios.get(getCdnProxyUrl).then(({data}) => {
      window.$cdn = data.recommended;

      const pagesUrl = 'https://api.lucaspape.de/lucaspape/pages';

      axios.get(pagesUrl).then(({data}) => {
        const newPages = [];

        newPages.push({name: 'Admin', uri: 'admin', contentPage:AdminPage, in_menu:false});
        newPages.push({name: 'Design', uri: 'admin/design', contentPage:DesignPage, in_menu:false});

        data.results.forEach((page) => {
          newPages.push(page);
        });

        this.setState({pages:newPages});

        this.generateCustomPageRoutes();
      });
    });
  }

  generateCustomPageRoutes(){
    const newPageRoutes = [];

    this.state.pages.forEach((page) => {
      if(page.contentPage){
        newPageRoutes.push(<Route exact path = {'/' + page.uri} render={ (props) => <PageWrapper pages={this.state.pages} id={page.id} name={page.name} content={page.contentPage} {...props}/>}/>);
      }else{
        newPageRoutes.push(<Route exact path = {'/' + page.uri} render={ (props) => <PageWrapper pages={this.state.pages} id={page.id} name={page.name} content={GenericPage} {...props}/>}/>);
      }
    });

    this.setState({pageRoutes:newPageRoutes});
  }
}

export default MainPage;
