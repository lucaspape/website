import React, { Component } from "react";

class GenericPage extends Component {
  render(){
    return(
      <div className="content">
        Id: {this.props.id}
      </div>
    );
  }
}

export default GenericPage;
