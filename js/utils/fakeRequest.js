import server from './fakeServer';

/**
 * @type {Object}
 */
var fakeRequest = {
  /**
   * @param  {string}    endpoint The endpoint of the server that should be contacted
   * @param  {?object}   data     The data that should be transferred to the server
   * @param  {?function} callback Called after the server successfully did it's thing
   */
  post(endpoint, data, callback) {
    setTimeout(() => {
      switch (endpoint) {
        case '/login':
          server.login(data.username, data.email, callback);
          break;
        case '/register':
          server.register(data.username, data.email, callback);
          break;
        case '/logout':
          server.logout(callback);
          break;
        default:
          break;
      }
    }, (Math.random() * 2000) + 100);
  }
}

module.exports = fakeRequest;
