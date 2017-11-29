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

import ErrorBoundary from 'components/ErrorBoundary';

import { closeNewInteractionPanel } from 'containers/AgentDesktop/actions';
import { selectHasCrmPermissions } from 'containers/App/selectors';

import Button from 'components/Button';

import ContactSearch from 'containers/ContactSearch';
import NewInteractionForm from './NewInteractionForm';
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
    overflowY: 'hidden',
    display: 'flex',
  },
  buttonContainer: {
    padding: '13px 0',
  },
  button: {
    float: 'right',
  },
};

export function NewInteractionContentArea(props, context) {
  return (
    <div style={styles.base}>
      <div style={styles.buttonContainer}>
        <Button
          id="cancelNewInteractionButton"
          type="secondary"
          style={styles.button}
          text={messages.cancel}
          onClick={props.closeNewInteractionPanel}
        />
      </div>
      <div style={styles.contacts}>
        {!context.toolbarMode && props.hasCrmPermissions ? (
          <ContactSearch />
        ) : (
          <NewInteractionForm />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  hasCrmPermissions: selectHasCrmPermissions(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    closeNewInteractionPanel: () => dispatch(closeNewInteractionPanel()),
    dispatch,
  };
}

NewInteractionContentArea.propTypes = {
  hasCrmPermissions: PropTypes.bool,
  closeNewInteractionPanel: PropTypes.func.isRequired,
};

NewInteractionContentArea.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(
    Radium(NewInteractionContentArea)
  )
);
