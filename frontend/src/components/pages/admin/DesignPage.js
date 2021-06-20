import React, { Component } from "react";

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

class DesignPage extends Component {
  state = {
    user: [],
    updateRequired: true
  };

  cookieJar = new tough.CookieJar();

  render(){
    if(this.state.updateRequired){
      const userUrl = 'https://api.lucaspape.de/lucaspape/user';

      axios.get(userUrl, {jar: this.cookieJar, withCredentials: true}).then(({data}) => {
        this.setState({user: data.results, updateRequired: false});
      });
    }

    if(this.state.user.id){
      return(
        <div>
          OK
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
}

export default DesignPage
