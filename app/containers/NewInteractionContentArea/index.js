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

import { closeNewInteractionPanel } from 'containers/AgentDesktop/actions';
import { setContactMode } from 'containers/InfoTab/actions';

import Button from 'components/Button';

import ContactSearch from 'containers/ContactSearch';
import messages from './messages';

const styles = {
  base: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingRight: '20px',
  },
  buttonContainer: {
    padding: '13px 0',
  },
  button: {
    float: 'right',
  },
};

export class NewInteractionContentArea extends BaseComponent {

  closeNewInteractionPanel = () => {
    this.props.closeNewInteractionPanel();
    this.props.setContactMode('viewing');
  }

  render() {
    return (
      <div style={styles.base}>
        <div style={styles.buttonContainer}>
          <Button
            id="cancelNewInteractionButton"
            type="secondary"
            style={styles.button}
            text={messages.cancel}
            onClick={this.closeNewInteractionPanel}
          />
        </div>
        <ContactSearch />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    closeNewInteractionPanel: () => dispatch(closeNewInteractionPanel()),
    setContactMode: (contactMode) => dispatch(setContactMode(contactMode)),
    dispatch,
  };
}

NewInteractionContentArea.propTypes = {
  closeNewInteractionPanel: PropTypes.func.isRequired,
  setContactMode: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Radium(NewInteractionContentArea));
