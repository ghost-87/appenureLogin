import request from './fakeRequest';

/**
 * @type {Object}
 */
var auth = {
  /**
   * @param  {string}   username The username of the user
   * @param  {string}   email The email of the user
   * @param  {Function} callback Called after a user was logged in on the remote server
   */


   login(username, email, callback) {
    if (this.loggedIn()) {
      callback(true);
      return;
    }
    request.post('/login', { username, email }, (response) => {
      if (response.authenticated) {
        localStorage.token = response.token;
        callback(true);
      } else {
        callback(false, response.error);
      }
    });
  },
  logout(callback) {
    request.post('/logout', {}, () => {
      callback(true);
    });
  },
  /**
   * @return {boolean} True if there is a logged in user, false if there isn't
   */
  loggedIn() {
    return !!localStorage.token;
  },
  /**
   * @param  {string}   username The username of the user
   * @param  {string}   email The email of the user
   * @param  {Function} callback Called after a user was registered on the remote server
   */
  register(username, email, callback) {
    request.post('/register', { username, email }, (response) => {
      if (response.registered === true) {
        this.login(username, email, callback);
      } else {
        callback(false, response.error);
      }
    });
  },
  onChange() {}
}

module.exports = auth;
