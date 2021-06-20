import React, { Component } from "react";

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  state = {
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
      this.props.update();
    }).catch((e)=>{
      console.log(e);
    });
  }

  render(){
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

export default Login;
