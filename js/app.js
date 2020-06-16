import 'file?name=[name].[ext]!../serviceworker.js';
import 'file?name=[name].[ext]!../serviceworker-cache-polyfill.js';
import 'file?name=[name].[ext]!../manifest.json';
import 'file?name=[name].[ext]!../.htaccess';
import 'file?name=[name].[ext]!../favicon.ico';
import 'file?name=[name].[ext]!../favicon.png';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js').then(() => {
  }).catch((err) => {
    console.log('ServiceWorker registration failed, error:', err);
  });
} else {
  console.log('ServiceWorker is not supported in this browser');
}

import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { homeReducer } from './reducers/reducers';
import FontFaceObserver from 'fontfaceobserver';

const openSansObserver = new FontFaceObserver('Open Sans');

openSansObserver.check().then(() => {
  document.body.classList.add('js-open-sans-loaded');
}, (err) => {
  document.body.classList.remove('js-open-sans-loaded');
});

import HomePage from './components/pages/HomePage.react';
import LoginPage from './components/pages/LoginPage.react';
import RegisterPage from './components/pages/RegisterPage.react';
import Dashboard from './components/pages/Dashboard.react';
import NotFound from './components/pages/NotFound.react';
import App from './components/App.react';

import '../css/main.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(homeReducer);


function checkAuth(nextState, replaceState) {
  let { loggedIn } = store.getState();

  if (nextState.location.pathname !== '/dashboard') {
    if (loggedIn) {
      if (nextState.location.state && nextState.location.pathname) {
        replaceState(null, nextState.location.pathname);
      } else {
        replaceState(null, '/');
      }
    }
  } else {
    if (!loggedIn) {
      if (nextState.location.state && nextState.location.pathname) {
        replaceState(null, nextState.location.pathname);
      } else {
        replaceState(null, '/');
      }
    }
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={HomePage} />
        <Route onEnter={checkAuth}>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/dashboard" component={Dashboard} />
        </Route>
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
