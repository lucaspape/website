import './homepage.css'

import React, { Component } from "react"

const axios = require('axios');

class Adminpage extends Component {
  state = {
    user: [],
    updateRequired: true
  };

  render(){
    if(this.state.updateRequired){
      const userUrl = 'https://api.lucaspape.de/lucaspape/user';

      axios.get(userUrl).then(({data}) => {
        this.setState({user: data.results, updateRequired: false});
      });
    }

    return (
      <div className='container-fluid'>
        { this.generateUser() }
      </div>
    );
  };

  generateUser(){
    if(this.state.user && this.state.user.length > 0){
      return(
        <div>
          Username: {this.state.user.name}
        </div>
      );
    }else{
      return this.generateLogin();
    }
  }

  generateLogin(){
    return(
      <div className='container-login'>
        LOGIN
      </div>
    );
  }
}

export default Adminpage;
