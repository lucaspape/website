import '../../css/generic_page.css';

import React, { Component } from "react";

const axios = require('axios');

class GenericPage extends Component {
  state = {
    posts: [],
    updateRequired: true
  };

  render(){
    if(this.state.updateRequired === true){
      const postsUrl = 'https://api.lucaspape.de/lucaspape/posts/' + this.props.id;

      axios.get(postsUrl).then(({data}) => {
        const newPosts = [];

        data.results.forEach((post) => {
          newPosts.push(this.generatePost(post));
        });

        this.setState({posts: newPosts, updateRequired: false});
      });
    }

    return(
      <div className='content'>
        <h1>
          {this.props.name}
        </h1>

         {this.state.posts}
      </div>
    );
  }

  generatePost(post){
    if(post.content_type === "text"){
      return(
        <div className='post_text'>
          {post.content}
        </div>
      );
    }else if(post.content_type === "image_url"){
      return(
        <div className='post_image'>
          <img src={post.content} alt=''/>
        </div>
      );
    }else if(post.content_type === "image_cdn"){
      return(
        <div className='post_image'>
          <img src={this.getCdnImageUrl(post.content)} alt=''/>
        </div>
      );
    }
  }

  getCdnImageUrl(hash){
    return window.$cdn + 'content/image/' + hash;
  }
}

export default GenericPage;
