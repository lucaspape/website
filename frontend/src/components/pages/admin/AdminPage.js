import React, { Component } from "react";
import NewPost from './components/NewPost.js';
import Login from './components/Login.js';

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

class AdminPage extends Component {
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

    return (
      <div className='content'>
        { this.generateUser() }
      </div>
    );
  };

  generateUser(){
    if(this.state.user.id){
      return(
        <div>
          Username: {this.state.user.name}

          {<NewPost/>}
        </div>
      );
    }else{
      return(
        <Login update={()=>{
          this.setState({updateRequired: true});
        }}/>
      );
    }
  }
}

export default AdminPage;
