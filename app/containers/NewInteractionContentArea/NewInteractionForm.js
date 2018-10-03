/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * NewInteractionForm
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import { isValidNumber, isValidEmail } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import TextInput from 'components/TextInput';

import OutboundEmailButton from 'containers/OutboundInteractionButton/OutboundEmailButton';
import OutboundSmsButton from 'containers/OutboundInteractionButton/OutboundSmsButton';
import OutboundCallButton from 'containers/OutboundInteractionButton/OutboundCallButton';

import { setNewInteractionPanelFormInput } from 'containers/AgentDesktop/actions';
import { selectNewInteractionPanel } from 'containers/AgentDesktop/selectors';

import messages from './messages';

const styles = {
  base: {
    paddingLeft: '20px',
    width: '100%',
    textAlign: 'center',
  },
  creatingNewInteractionFor: {
    marginBottom: '20px',
  },
  input: {
    marginTop: '50px',
    width: '100%',
    textAlign: 'center',
  },
  hr: {
    width: '50%',
    margin: '30px 25%',
  },
};

const formatPhoneNumber = (input) => {
  const formattedInput = input.replace(/\D+/g, '');
  if (/([()-])+/.test(input)) {
    // If the number is formatted with parentheses and a dash (ex "(506) 123-4567"), pre-pend the "1"
    return `+1${input.replace(/\D+/g, '')}`;
  } else if (isValidNumber(`+${formattedInput}`)) {
    // Check if it's a valid number
    return `+${formattedInput}`;
  } else if (isValidNumber(`+1${formattedInput}`)) {
    // Check if it's valid with "1" pre-pended
    return `+1${input.replace(/\D+/g, '')}`;
  } else if (isValidNumber(`+44${formattedInput}`)) {
    // Check if it's valid with "44" pre-pended
    return `+44${formattedInput}`;
  } else {
    return formattedInput;
  }
};

export function NewInteractionForm(props) {
  return (
    <div style={styles.base}>
      {props.uriObject !== undefined ? (
        <div style={styles.creatingNewInteractionFor}>
          <FormattedMessage
            {...messages.creatingNewInteractionFor}
            values={{ objectName: props.uriObject.objectName }}
          />
        </div>
      ) : (
        <Fragment>
          <TextInput
            id="newInteractionFormInput"
            cb={props.setNewInteractionPanelFormInput}
            value={props.input}
            style={styles.input}
            placeholder={messages.newInteractionFormInstructions}
            autoFocus
          />
          <hr style={styles.hr} />
        </Fragment>
      )}
      {!isValidEmail(props.input) && (
        <OutboundCallButton phoneNumber={formatPhoneNumber(props.input)} />
      )}
      {!isValidEmail(props.input) && (
        <OutboundSmsButton phoneNumber={formatPhoneNumber(props.input)} />
      )}
      {!isValidNumber(formatPhoneNumber(props.input)) && (
        <OutboundEmailButton email={props.input} />
      )}
    </div>
  );
}

function mapStateToProps(state, props) {
  const newInteractionPanel = selectNewInteractionPanel(state, props);
  return {
    input: newInteractionPanel.newInteractionFormInput,
    uriObject: newInteractionPanel.uriObject,
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
  uriObject: PropTypes.shape({
    objectName: PropTypes.string,
  }),
  setNewInteractionPanelFormInput: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(NewInteractionForm))
);
