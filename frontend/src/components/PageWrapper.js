import '../css/page.css';

import React, { Component } from "react";

import PageNavigation from './PageNavigation.js';

class PageWrapper extends Component {
  render(){
    return(
      <div className="page">
        <PageNavigation pages={this.props.pages}/>
        <this.props.content id={this.props.id} name={this.props.name}/>
      </div>
    );
  }
}

export default PageWrapper;
