import '../css/feed.css'

import React, { Component } from "react"

const axios = require('axios');

class Feed extends Component {
  state = {
    posts: [],
    updateRequired: true
  };

  render(){
    if(this.state.updateRequired === true){
      const postsUrl = 'https://api.lucaspape.de/lucaspape/posts';

      axios.get(postsUrl).then(({data}) => {
        var newPosts = [];

        for(var i=0; i<data.results.length; i++){
          newPosts.push(this.generatePost(data.results[i]));
        }

        this.setState({posts: newPosts, updateRequired: false});
      });
    }

    return (
      <div className='feed'>
        <h1>
          Feed
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
          <img src={post.content}/>
        </div>
      );
    }
  }
}

export default Feed;
