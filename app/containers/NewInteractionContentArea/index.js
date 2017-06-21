/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * NewInteractionContentArea
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import { closeNewInteractionPanel, setContactMode } from 'containers/AgentDesktop/actions';

import Button from 'components/Button';

import ContactSearch from 'containers/ContactSearch';
import messages from './messages';

const styles = {
  base: {
    paddingRight: '20px',
    height: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  },
  contacts: {
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
  },
  buttonContainer: {
    padding: '13px 0',
  },
  button: {
    float: 'right',
  },
};

export class NewInteractionContentArea extends BaseComponent {

  render() {
    return (
      <div style={styles.base}>
        <div style={styles.buttonContainer}>
          <Button
            id="cancelNewInteractionButton"
            type="secondary"
            style={styles.button}
            text={messages.cancel}
            onClick={this.props.closeNewInteractionPanel}
          />
        </div>
        <div style={styles.contacts}>
          <ContactSearch />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    closeNewInteractionPanel: () => dispatch(closeNewInteractionPanel()),
    setContactMode: (interactionId, newMode) => dispatch(setContactMode(interactionId, newMode)),
    dispatch,
  };
}

NewInteractionContentArea.propTypes = {
  closeNewInteractionPanel: PropTypes.func.isRequired,
  setContactMode: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Radium(NewInteractionContentArea));
