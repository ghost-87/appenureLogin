import bcrypt from 'bcryptjs';
import genSalt from './salt';
const salt = bcrypt.genSaltSync(10);
let users;
let localStorage = global.window.localStorage;

/**
 * @type {Object}
 */
var server = {
  
  init() {
    // fetchPerson() {
    //   fetch(`https://5ede0f2ae36dd000166c7e8b.mockapi.io/user/1`)
    //     .then(data => data.json())
    //     .then(Person => {
    //       this.setState({ Person }, () => {
    //         console.log('bera',Person);
    //       });  
    //     })
    //     .catch(error => {
    //       console.log(error);
    //   })
    // }
    
    // fetchRepos = () => {
    //   fetch(`https://5ede0f2ae36dd000166c7e8b.mockapi.io/user/1`)
    //     .then(data => data.json())
    //     .then(langResults => {
    //       this.setState({ langResults }, 
    //         ()=>{
    //         this.setState({Repos:langResults});}
    //       );
    //     })
    //     .catch(error => {
    //       console.log(error);
    //   })
    //     console.log('reposResult',this.state.langResults);
    // }
  
    if (localStorage.users === undefined || !localStorage.encrypted) {
      const userName = "nishant aggarwal";
      const userNameSalt = genSalt(userName);
      const userNameEmail = bcrypt.hashSync("nishant@gmail.com", userNameSalt);
      users = {
        [userName]: bcrypt.hashSync(userNameEmail, salt)
      };
      localStorage.users = JSON.stringify(users);
      localStorage.encrypted = true;
    } else {
      users = JSON.parse(localStorage.users);
    }
  },
  /**
   * @param {string} username The username of the user to log in
   * @param {string} email The email of the user to register
   * @param {?callback} callback Called after a user is logged in
   */
  login(username, email, callback) {
    const userExists = this.doesUserExist(username);
    if (userExists && bcrypt.compareSync(email, users[username])) {
      if (callback) callback({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      });
    } else {
      if (userExists) {
        var error = {
          type: "email-wrong"
        }
      } else {
        var error = {
          type: "user-doesnt-exist"
        }
      }
      if (callback) callback({
        authenticated: false,
        error: error
      });
    }
  },
  /**
   * @param {string} username The username of the user to register
   * @param {string} email The email of the user to register
   * @param {?callback} callback Called after a user is registered
   */
  register(username, email, callback) {
    if (!this.doesUserExist(username)) {
      users[username] = bcrypt.hashSync(email, salt);
      localStorage.users = JSON.stringify(users);
      if (callback) callback({
        registered: true
      });
    } else {
      if (callback) callback({
        registered: false,
        error: {
          type: "username-exists"
        }
      });
    }
  },
  /**
   * @param  {Function} callback Called after the user was logged out
   */
  logout(callback) {
    localStorage.removeItem('token');
    if (callback) callback();
  },
  /**
   * @param  {string} username The username that should be checked
   * @return {boolean}         True if the username exists, false if it doesn't
   */
  doesUserExist(username) {
    return !(users[username] === undefined);
  }
}

server.init();

module.exports = server;
