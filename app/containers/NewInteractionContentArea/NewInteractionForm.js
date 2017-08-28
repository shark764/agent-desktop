/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * NewInteractionForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import { isValidNumber, isValidEmail } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import TextInput from 'components/TextInput';

import OutboundEmailButton from 'containers/OutboundInteractionButton/OutboundEmailButton';
import OutboundSmsButton from 'containers/OutboundInteractionButton/OutboundSmsButton';

import { setNewInteractionPanelFormInput } from 'containers/AgentDesktop/actions';
import { selectNewInteractionPanel } from 'containers/AgentDesktop/selectors';

import messages from './messages';

const styles = {
  base: {
    paddingLeft: '20px',
    width: '100%',
  },
  input: {
    marginTop: '50px',
    width: '100%',
  },
  hr: {
    width: '50%',
    margin: '30px 25%',
  },
};

export function NewInteractionForm(props) {
  return (
    <div style={styles.base}>
      <TextInput
        id="newInteractionFormInput"
        cb={props.setNewInteractionPanelFormInput}
        value={props.input}
        style={styles.input}
        placeholder={messages.newInteractionFormInstructions}
      />
      <hr style={styles.hr} />
      {!isValidEmail(props.input) &&
        <OutboundSmsButton phoneNumber={props.input} />}
      {!isValidNumber(props.input) &&
        <OutboundEmailButton email={props.input} />}
    </div>
  );
}

function mapStateToProps(state, props) {
  const newInteractionPanel = selectNewInteractionPanel(state, props);
  return {
    input: newInteractionPanel.newInteractionFormInput,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setNewInteractionPanelFormInput: (input) =>
      dispatch(setNewInteractionPanelFormInput(input)),
    dispatch,
  };
}

NewInteractionForm.propTypes = {
  input: PropTypes.string.isRequired,
  setNewInteractionPanelFormInput: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(NewInteractionForm))
);
