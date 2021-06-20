import React, { Component } from "react";

const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

class NewPost extends Component {
  constructor(props) {
    super(props);

    this.handlePageIdInputChange = this.handlePageIdInputChange.bind(this);
    this.handleAuthorNameInputChange = this.handleAuthorNameInputChange.bind(this);
    this.handleContentTypeInputChange = this.handleContentTypeInputChange.bind(this);
    this.handleContentInputChange = this.handleContentInputChange.bind(this);
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
  }

  state = {
    page_id_input: '',
    author_name_input: '',
    content_type_input: '',
    content_input: ''
  }

  cookieJar = new tough.CookieJar();

  handlePageIdInputChange(event){
    this.setState({page_id_input: event.target.value});
  }

  handleAuthorNameInputChange(event){
    this.setState({author_name_input: event.target.value});
  }

  handleContentTypeInputChange(event){
    this.setState({content_type_input: event.target.value});
  }

  handleContentInputChange(event){
    this.setState({content_input: event.target.value});
  }

  handlePostSubmit(event){
    event.preventDefault();

    const loginUrl = 'https://api.lucaspape.de/lucaspape/posts/' + this.state.page_id_input;

    axios.post(loginUrl,
      {
        author: this.state.author_name_input,
        content_type: this.state.content_type_input,
        content: this.state.content_input
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
    return (
      <div>
        <form onSubmit={(event) => this.handlePostSubmit(event)}>
          <label>
            Page ID:
            <input type="text" value={this.state.page_id_input} onChange={this.handlePageIdInputChange}/>
          </label>

          <label>
            Author name:
            <input type="text" value={this.state.author_name_input} onChange={this.handleAuthorNameInputChange}/>
          </label>

          <label>
            Content-Type:
            <input type="text" value={this.state.content_type_input} onChange={this.handleContentTypeInputChange}/>
          </label>

          <label>
            Content:
            <input type="text" value={this.state.content} onChange={this.handleContentInputChange}/>
          </label>

          <input type="submit" value="Submit Post"/>
        </form>
      </div>
    );
  };
}

export default NewPost;