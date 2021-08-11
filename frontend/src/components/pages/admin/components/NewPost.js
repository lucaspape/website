import React, { Component } from "react";

const axios = require('axios');

class NewPost extends Component {
  constructor(props) {
    super(props);

    this.handlePageIdInputChange = this.handlePageIdInputChange.bind(this);
    this.handleAuthorNameInputChange = this.handleAuthorNameInputChange.bind(this);
    this.handleContentTypeInputChange = this.handleContentTypeInputChange.bind(this);
    this.handleContentInputChange = this.handleContentInputChange.bind(this);
    this.handleFileUploadChange = this.handleFileUploadChange.bind(this);
    this.handleFileUploadSubmit = this.handleFileUploadSubmit.bind(this);
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
  }

  state = {
    page_id_input: '',
    author_name_input: this.props.username,
    content_type_input: '',
    content_input: '',
    selected_file_input: null,
    pages: [],
    updateRequired: true
  }

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

  handleFileUploadChange(event){
    this.setState({selected_file_input: event.target.files[0]});
  };

  handleFileUploadSubmit(event){
    event.preventDefault();

    const data = new FormData();
    data.append('file', this.state.selected_file_input);

    axios.post('https://cdn.lucaspape.de/content/image?key=' + window.$post_key, data,
      {
        withCredentials: true
      }
    ).then(({data}) => {
      console.log(data.sha256);
      this.setState({content_input: data.sha256});
    });
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
    if(this.state.updateRequired){
      const pagesUrl = 'https://api.lucaspape.de/lucaspape/pages';

      axios.get(pagesUrl).then(({data}) => {
        const newPages = [];

        data.results.forEach((page) => {
          newPages.push(page);
        });

        this.setState({pages:newPages, updateRequired: false});
      });
    }

    return (
      <div>
        <form className="input_form" onSubmit={(event) => this.handleFileUploadSubmit(event)}>
          <label>
            File Upload:
            <input type='file' name='file' onChange={this.handleFileUploadChange}/>
          </label>

          <input type="submit" value="Upload File"/>
        </form>

        <form className="input_form" onSubmit={(event) => this.handlePostSubmit(event)}>
          <label>
            Page:
            {this.generatePageSelector()}
          </label>

          <label>
            Author name:
            <input type="text" value={this.state.author_name_input} onChange={this.handleAuthorNameInputChange}/>
          </label>

          <label>
            Content-Type:
            {this.generateContentTypeSelector()}
          </label>

          <label>
            Content:
            <input type="text" value={this.state.content_input} onChange={this.handleContentInputChange}/>
          </label>

          <input type="submit" value="Submit Post"/>
        </form>
      </div>
    );

  };

  generatePageSelector(){
    const options = [];

    options.push(<option value="" selected disabled hidden>Choose Page</option>);

    this.state.pages.forEach((page) => {
      options.push(<option value={page.id}>{page.name}</option>);
    });

    return(
      <select value={this.state.page_id_input} onChange={this.handlePageIdInputChange}>
        {options}
      </select>
    );
  }

  generateContentTypeSelector(){
    const options_description = ["Text", "Image URL", "CDN Image"];
    const options_text = ["text", "image_url", "image_cdn"];

    const options = [];

    options.push(<option value="" selected disabled hidden>Choose Content-Type</option>);

    options_text.forEach((item, i) => {
      options.push(<option value={item}>{options_description[i]}</option>);
    });

    return(
      <select value={this.state.content_type_input} onChange={this.handleContentTypeInputChange}>
        {options}
      </select>
    );
  }
}

export default NewPost;
