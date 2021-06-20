import React, { Component } from "react";
import NewPost from '../NewPost.js';

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  state = {
    user: [],
    updateRequired: true,
    usrname_input: '',
    password_input: ''
  };

  cookieJar = new tough.CookieJar();

  handleUsernameInputChange(event){
    this.setState({username_input: event.target.value});
  }

  handlePasswordInputChange(event){
    this.setState({password_input: event.target.value});
  }

  handleLoginSubmit(event){
    event.preventDefault();

    const loginUrl = 'https://api.lucaspape.de/lucaspape/user/login';

    axios.post(loginUrl,
      {
        username: this.state.username_input,
        password: this.state.password_input
      },
      {
        jar: this.cookieJar,
        withCredentials: true
      }
    ).then(({data}) => {
      this.setState({updateRequired: true});
    }).catch((e)=>{
      console.log(e);
    });
  }

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

          {<NewPost></NewPost>}
        </div>
      );
    }else{
      return this.generateLogin();
    }
  }

  generateLogin(){
    return(
      <div className='container-login'>
        <form onSubmit={(event) => this.handleLoginSubmit(event)}>
          <label>
            Username:
            <input type="text" value={this.state.username_input} onChange={this.handleUsernameInputChange}/>
          </label>

          <label>
            Password:
            <input type="text" value={this.state.password_input} onChange={this.handlePasswordInputChange}/>
          </label>

          <input type="submit" value="Login" />
        </form>
      </div>
    );
  }
}

export default AdminPage;
