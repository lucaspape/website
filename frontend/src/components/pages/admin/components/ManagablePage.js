import React, { Component } from "react";

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

class ManagablePage extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteButton = this.handleDeleteButton.bind(this);
  }

  cookieJar = new tough.CookieJar();

  handleDeleteButton(){
    const deletePageUrl = 'https://api.lucaspape.de/lucaspape/pages/' + this.props.page.id;

    axios.delete(deletePageUrl,
      {
        jar: this.cookieJar,
        withCredentials: true
      }
    ).then(({data}) => {
      this.props.update();
    });
  }

  render(){
    return (
      <div>
        {this.props.page.name}

        <button onClick={this.handleDeleteButton}>Delete Page</button>
      </div>
    );
  }
}

export default ManagablePage;
