import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../Nav.react';
import { connect } from 'react-redux';

class HomePage extends Component {

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
	  
	  

	render() {
    const dispatch = this.props.dispatch;
    const { loggedIn } = this.props.data;

    return (
			<article>
				<div>
					<section className="text-section">
						{loggedIn ? (
							<h1>Welcome to Login Flow, you are logged in!</h1>
						) : (
							<h1>Welcome to Login Flow!</h1>
						)}
						{loggedIn ? (
							<Link to="/dashboard" className="btn btn--dash">Profile</Link>
						) : (
							<div>
								<Link to="/login" className="btn btn--login">Login</Link>
								<Link to="/register" className="btn btn--register">Register</Link>
							</div>
						)}
					</section>
				</div>
			</article>
		);
  }
}

function select(state) {
  return {
    data: state
  };
}

export default connect(select)(HomePage);
