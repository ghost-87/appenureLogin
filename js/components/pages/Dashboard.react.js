import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component {

  constructor(props)  {
    super(props);
    this.state = {
      Person: [],
      Repos:[],
    }
  }
    componentDidMount = () => {
      this.fetchPerson();
      this.fetchRepos();
    }
  
  
  fetchPerson = () => {
    fetch(`https://5ede0f2ae36dd000166c7e8b.mockapi.io/user/1`)
      .then(data => data.json())
      .then(Person => {
        this.setState({ Person }, () => {
          console.log('bera',Person);
        });  
      })
      .catch(error => {
        console.log(error);
    })
  }
  
  fetchRepos = (param) => {
    fetch(`https://api.github.com/users/supreetsingh247/repos?${param}`)
      .then(data => data.json())
      .then(langResults => {
        this.setState({ langResults }, 
          ()=>{
          this.setState({Repos:langResults});}
        );
      })
      .catch(error => {
        console.log(error);
    })
      console.log('reposResult',this.state.langResults);
  }
 

  render() {
    return (
      <article>
        <section className="text-section">
          <h1>Dashboard</h1>
          <p>Welcome, you are logged in here!</p>
        </section>
      </article>
    );
  }
}

function select(state) {
  return {
    data: state
  };
}

export default connect(select)(Dashboard);
