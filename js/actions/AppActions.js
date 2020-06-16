import bcrypt from 'bcryptjs';
import { SET_AUTH, CHANGE_FORM, SENDING_REQUEST, SET_ERROR_MESSAGE } from '../constants/AppConstants';
import * as errorMessages  from '../constants/MessageConstants';
import auth from '../utils/auth';
import genSalt from '../utils/salt';
import { browserHistory } from 'react-router';

/**
 * @param  {string} username The username of the user to be logged in
 * @param  {string} email The email of the user to be logged in
 */
export function login(username, email) {
  return (dispatch) => {
    dispatch(sendingRequest(true));
    if (anyElementsEmpty({ username, email })) {
      dispatch(setErrorMessage(errorMessages.FIELD_MISSING));
      dispatch(sendingRequest(false));
      return;
    }
    const salt = genSalt(username);
    bcrypt.hash(email, salt, (err, hash) => {
      if (err) {
        dispatch(setErrorMessage(errorMessages.GENERAL_ERROR));
        return;
      }
      auth.login(username, hash, (success, err) => {
        dispatch(sendingRequest(false));
        dispatch(setAuthState(success));
        if (success === true) {
          forwardTo('/dashboard');
          dispatch(changeForm({
            username: "",
            email: ""
          }));
        } else {
          switch (err.type) {
            case 'user-doesnt-exist':
              dispatch(setErrorMessage(errorMessages.USER_NOT_FOUND));
              return;
            case 'email-wrong':
              dispatch(setErrorMessage(errorMessages.WRONG_email));
              return;
            default:
              dispatch(setErrorMessage(errorMessages.GENERAL_ERROR));
              return;
          }
        }
      });
    });
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(sendingRequest(true));
    auth.logout((success, err) => {
      if (success === true) {
        dispatch(sendingRequest(false))
        dispatch(setAuthState(false));
        browserHistory.replace(null, '/');
      } else {
        dispatch(setErrorMessage(errorMessages.GENERAL_ERROR));
      }
    });
  }
}

/**
 * @param  {string} username The username of the new user
 * @param  {string} email The email of the new user
 */
export function register(username, email) {
  return (dispatch) => {
    dispatch(sendingRequest(true));
    if (anyElementsEmpty({ username, email })) {
      dispatch(setErrorMessage(errorMessages.FIELD_MISSING));
      dispatch(sendingRequest(false));
      return;
    }
    const salt = genSalt(username);
    bcrypt.hash(email, salt, (err, hash) => {
      if (err) {
        dispatch(setErrorMessage(errorMessages.GENERAL_ERROR));
        return;
      }
      auth.register(username, hash, (success, err) => {
        dispatch(sendingRequest(false));
        dispatch(setAuthState(success));
        if (success) {
          forwardTo('/dashboard');
          dispatch(changeForm({
            username: "",
            email: ""
          }));
        } else {
          switch (err.type) {
            case 'username-exists':
              dispatch(setErrorMessage(errorMessages.USERNAME_TAKEN));
              return;
            default:
              dispatch(setErrorMessage(errorMessages.GENERAL_ERROR));
              return;
          }
        }
      });
    });
  }
}

/**
 * @param {boolean} newState True means a user is logged in, false means no user is logged in
 */
export function setAuthState(newState) {
  return { type: SET_AUTH, newState };
}

/**
 * @param  {object} newState          The new state of the form
 * @param  {string} newState.username The new text of the username input field of the form
 * @param  {string} newState.email The new text of the email input field of the form
 * @return {object}                   Formatted action for the reducer to handle
 */
export function changeForm(newState) {
  return { type: CHANGE_FORM, newState };
}

/**
 * @param  {boolean} sending The new state the app should have
 * @return {object}          Formatted action for the reducer to handle
 */
export function sendingRequest(sending) {
  return { type: SENDING_REQUEST, sending };
}


/**
 * @param message
 */
function setErrorMessage(message) {
  return (dispatch) => {
    dispatch({ type: SET_ERROR_MESSAGE, message });

    const form = document.querySelector('.form-page__form-wrapper');
    if (form) {
      form.classList.add('js-form__err-animation');
      setTimeout(() => {
        form.classList.remove('js-form__err-animation');
      }, 150);

      setTimeout(() => {
        dispatch({ type: SET_ERROR_MESSAGE, message: '' });
      }, 9012);
    }
  }
}

/**
 * @param {string} location The route the user should be forwarded to
 */
function forwardTo(location) {
  console.log('forwardTo(' + location + ')');
  browserHistory.push(location);
}


/**
 * @param  {object} elements The object that should be checked
 * @return {boolean}         True if there are empty elements, false if there aren't
 */
function anyElementsEmpty(elements) {
  for (let element in elements) {
    if (!elements[element]) {
      return true;
    }
  }
  return false;
}
