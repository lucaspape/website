import ManagablePage from './components/ManagablePage.js';
import NewPage from './components/NewPage.js';

import React, { Component } from "react";

const axios = require('axios');

class DesignPage extends Component {
  state = {
    user: [],
    updateRequired: true,
    managablePages: []
  };

  render(){
    if(this.state.updateRequired){
      const userUrl = 'https://api.lucaspape.de/lucaspape/user';

      axios.get(userUrl, {jar: this.cookieJar, withCredentials: true}).then(({data}) => {
        const pagesUrl = 'https://api.lucaspape.de/lucaspape/pages';

        this.setState({user: data.results, updateRequired: false});

        axios.get(pagesUrl).then(({data}) => {
          this.generateManagablePages(data.results);
        });
      });
    }

    if(this.state.user.id){
      return(
        <div className="content">
          <NewPage/>
          {this.state.managablePages}
        </div>
      );
    }else{
      return(
        <div>
          PLEASE LOGIN
        </div>
      );
    }
  }

  generateManagablePages(pages){
    const newManagablePages = [];

    pages.forEach((page) => {
      newManagablePages.push(<ManagablePage page={page} update={()=>{
        this.setState({updateRequired: true});
      }}/>);
    });

    this.setState({managablePages: newManagablePages});
  }
}

export default DesignPage
