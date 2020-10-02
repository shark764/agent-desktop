/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * CenteredConfirmationPopup
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Button from 'components/Button';
import TextBlob from 'components/TextBlob';
import TextInput from 'components/TextInput';

const styles = {
  screen: {
    display: 'flex',
    flexDirection: 'row',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(5, 30, 36, .75)',
    zIndex: 1000,
  },
  modalWindow: {
    height: '363px',
    width: '455px',
    borderRadius: '3px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.09)',
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    textAlign: 'center',
  },
  fieldDescText: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  passwordField: {
    marginBottom: '15px',
    width: '100%',
  },
  passwordSubmitButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: '10px',
  },
  loginBtn: {
    width: '45%',
    marginRight: '15px',
  },
};

export class CenteredConfirmationPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordVal: '',
    };
  }

  handleInputChange = (newVal) => {
    this.setState({ passwordVal: newVal });
  };

  submitPassword = () => this.props.loginBtn.callback(this.state.passwordVal);

  submitBtnDisabled = () =>
    this.props.displayPasswordField && !this.state.passwordVal.length;

  supplyModalWidth = () => {
    if (this.context.toolbarMode) {
      return { ...styles.modalWindow, width: '350px'};
    }

    return styles.modalWindow;
  };

  render() {
    return (
      <div style={styles.screen}>
        <div style={this.supplyModalWidth()}>
          <div style={styles.modalContent}>
            <TextBlob
              id="passwordFieldDesc"
              text={this.props.modalDescriptionText}
              style={styles.fieldDescText}
            />
            {this.props.displayPasswordField && (
              <TextInput
                id="passwordField"
                onEnter={this.submitPassword}
                value={this.state.passwordVal}
                style={styles.passwordField}
                type="password"
                key="password"
                autoFocus
                cb={this.handleInputChange}
              />
            )}
            <span style={styles.passwordSubmitButtons}>
              <Button
                id={this.props.loginBtn.id}
                type={this.props.loginBtn.type}
                text={this.props.loginBtn.text}
                style={styles.loginBtn}
                disabled={this.submitBtnDisabled()}
                onClick={this.submitPassword}
              />
              <Button
                id={this.props.logoutBtn.id}
                type={this.props.logoutBtn.type}
                text={this.props.logoutBtn.text}
                onClick={() => this.props.logoutBtn.callback()}
              />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

CenteredConfirmationPopup.contextTypes = {
  toolbarMode: PropTypes.bool,
};

CenteredConfirmationPopup.propTypes = {
  displayPasswordField: PropTypes.bool,
  modalDescriptionText: PropTypes.string,
  loginBtn: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    callback: PropTypes.func,
  }),
  logoutBtn: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    callback: PropTypes.func,
  }),
};

export default Radium(CenteredConfirmationPopup);
