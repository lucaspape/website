import './homepage.css'

import React from 'react';

class Adminpage extends Component {
  state = {
    user: undefined,
    updateRequired: true
  };

  render(){
    if(this.state.updateRequired){
      const userUrl = 'https://api.lucaspape.de/lucaspape/user';

      axios.get(postsUrl).then(({data}) => {
        this.setState({user: data.results, updateRequired: false});
      });
    }

    return (
      <div className='container-fluid'>
        { generateUser(); }
      </div>
    );
  };

  generateUser(){
    if(this.state.user){
      return(
        <div>
          Username: this.state.name
        </div>
      );
    }else{
      return this.generateLogin();
    }
  }

  generateLogin(){
    return(
      <div className='container-login'>
        LOGIN
      </div>
    );
  }
}

export default Adminpage;
