import '../css/navigation.css';

import React, { Component } from "react";

import {
    Link
  } from 'react-router-dom';

class PageNavigation extends Component {
  render(){
    return(
      <nav className="navigation">
        <ul>
          {this.generateListItems()}
        </ul>
      </nav>
    );
  }

  generateListItems(){
    const listItems = [];

    this.props.pages.forEach((page) => {
      listItems.push(<li><Link to={page.uri}>{page.name}</Link></li>);
    });

    return listItems;
  }
}

export default PageNavigation;
