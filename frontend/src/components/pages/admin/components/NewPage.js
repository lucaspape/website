import React, { Component } from "react";

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

class NewPage extends Component {
  constructor(props) {
    super(props);

    this.handleNameInputChange = this.handleNameInputChange.bind(this);
    this.handleUriInputChange = this.handleUriInputChange.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
  }

  state = {
    page_name_input: '',
    page_uri_input: ''
  }

  cookieJar = new tough.CookieJar();

  handleNameInputChange(event){
    this.setState({page_name_input: event.target.value});
  }

  handleUriInputChange(event){
    this.setState({page_uri_input: event.target.value});
  }

  handleCreateSubmit(event){
    event.preventDefault();

    const loginUrl = 'https://api.lucaspape.de/lucaspape/pages';

    axios.post(loginUrl,
      {
        name: this.state.page_name_input,
        uri: this.state.page_uri_input
      },
      {
        jar: this.cookieJar,
        withCredentials: true
      }
    ).then(({data}) => {

    }).catch((e)=>{
      console.log(e);
    });
  }

  render(){
    return (
      <div>
        <form className="input_form" onSubmit={(event) => this.handleCreateSubmit(event)}>
          <label>
            Page Name:
            <input type="text" value={this.state.page_name_input} onChange={this.handleNameInputChange}/>
          </label>

          <label>
            URI:
            <input type="text" value={this.state.page_uri_input} onChange={this.handleUriInputChange}/>
          </label>

          <input type="submit" value="Create Page"/>
        </form>
      </div>
    );

  };
}

export default NewPage;
