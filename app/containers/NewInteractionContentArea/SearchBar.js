/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * SearchBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { PhoneNumberUtil } from 'google-libphonenumber';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import search from 'assets/icons/search.png';

import Button from 'components/Button';
import TextInput from 'components/TextInput';

import messages from './messages';

const styles = {
  searchBar: {
    backgroundColor: '#F3F3F3',
    padding: '13px 20px',
    borderBottom: '1px solid #D0D0D0',
    whiteSpace: 'nowrap',
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    backgroundImage: `url(${search})`,
    backgroundPosition: '10px 10px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    padding: '3px 3px 3px 40px',
    height: '36px',
    borderRadius: '2px',
    border: 'solid 1px #979797',
    ':focus': {
      boxShadow: '0 0 6px 1px rgba(0, 0, 0, 0.12)',
      border: 'solid 1px #23CEF5',
    },
    width: 'calc(100% - 181px)',
    minWidth: '170px',
    display: 'inline-block',
  },
  input: {
    height: '100%',
    width: '100%',
    outline: 'none',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    ':focus': {
      outline: 'none',
    },
    padding: 0,
  },
  button: {
    marginLeft: '13px',
  },
};

export class SearchBar extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      validSearchTerm: false,
    };
  }

  // TODO refactor isValidNumber function into util
  phoneNumberUtil = PhoneNumberUtil.getInstance();

  setSearchTerm = (searchTerm) => {
    let validSearchTerm = false;
    try {
      validSearchTerm = this.phoneNumberUtil.isValidNumber(this.phoneNumberUtil.parse(searchTerm, 'E164'));
    } catch (e) {
      // Do nothing, this just means it is invalid
    }
    this.setState({ searchTerm, validSearchTerm });
  }

  searchContacts = () => {
    if (this.state.validSearchTerm) {
      this.props.searchContacts(this.state.searchTerm);
    }
  }

  render() {
    return (
      <div style={styles.searchBar}>
        <div style={styles.inputBox}>
          <TextInput
            id="new-interaction-search"
            noBorder
            autoFocus
            style={[styles.input, styles.pendingFilterInput]}
            cb={this.setSearchTerm}
            value={this.state.searchTerm}
            onEnter={this.searchContacts}
          />
        </div>
        <Button
          id="searchNewInteractionButton"
          type="primaryBlue"
          style={styles.button}
          text={messages.search}
          disabled={!this.state.validSearchTerm}
          onClick={this.searchContacts}
        />
        <Button
          id="cancelNewInteractionButton"
          type="secondary"
          style={styles.button}
          text={messages.cancel}
          onClick={this.props.closeNewInteractionPanel}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    dispatch,
  };
}

SearchBar.propTypes = {
  searchContacts: PropTypes.func.isRequired,
  closeNewInteractionPanel: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Radium(SearchBar));
