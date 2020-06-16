import React, { Component } from 'react';
import { changeForm } from '../actions/AppActions';
import LoadingButton from './LoadingButton.react';
import ErrorMessage from './ErrorMessage.react';
import ProfileImage from './181000.jpg';

const assign = Object.assign || require('object.assign');

class LoginForm extends Component {
  render() {
    return(
      <form className="form" onSubmit={this._onSubmit.bind(this)}>
        <ErrorMessage />
        <div className="form__image__field-wrapper">
          <img className="form_image_field-wrapper" src={ProfileImage} alt="profilePic"/>
        </div>
        <div className="form__field-wrapper">
          <input className="form__field-input" type="text" id="username" value={this.props.data.username} placeholder="userName" onChange={this._changeUsername.bind(this)} autoCorrect="off" autoCapitalize="off" spellCheck="false" />
          <label className="form__field-label" htmlFor="username">Username</label>
        </div>
        <div className="form__field-wrapper">
          <input className="form__field-input" id="email" type="email" value={this.props.data.email} placeholder="abc@example.com"  onChange={this._changeemail.bind(this)} />
          <label className="form__field-label" htmlFor="email">Email</label>
        </div>
        <div className="form__submit-btn-wrapper">
          {this.props.currentlySending ? (
            <LoadingButton />
          ) : (
            <button className="form__submit-btn" type="submit">{this.props.btnText}</button>
          )}
        </div>
      </form>
    );
  }

  _changeUsername(evt) {
    var newState = this._mergeWithCurrentState({
      username: evt.target.value
    });

    this._emitChange(newState);
  }

  _changeemail(evt) {
    var newState = this._mergeWithCurrentState({
      email: evt.target.value
    });

    this._emitChange(newState);
  }

  _mergeWithCurrentState(change) {
    return assign(this.props.data, change);
  }

  _emitChange(newState) {
    this.props.dispatch(changeForm(newState));
  }

  _onSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit(this.props.data.username, this.props.data.email);
  }
}

LoginForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  btnText: React.PropTypes.string.isRequired,
  data: React.PropTypes.object.isRequired
}

export default LoginForm;
