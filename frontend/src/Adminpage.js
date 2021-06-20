import './homepage.css'

import React, { Component } from "react"

const axios = require('axios');

class Adminpage extends Component {
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

  handleUsernameInputChange(event){
    this.setState({username_input: event.target.value});
  }

  handlePasswordInputChange(event){
    this.setState({password_input: event.target.value});
  }

  handleLoginSubmit(event){
    const loginUrl = 'https://api.lucaspape.de/lucaspape/user/login';

    axios.post(loginUrl, {username: this.state.username_input, password: this.state.password_input}).then(({data}) => {
      this.setState({updateRequired: true});
    });
  }

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
        <form onSubmit={this.handleLoginSubmit}>
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

export default Adminpage;
