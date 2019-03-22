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
import { FormattedMessage } from 'react-intl';

import { isPossibleNumber, isValidNumber, isValidEmail } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import TextInput from 'components/TextInput';

import OutboundAniSelect from 'containers/OutboundAniSelect';

import OutboundEmailButton from 'containers/OutboundInteractionButton/OutboundEmailButton';
import OutboundSmsButton from 'containers/OutboundInteractionButton/OutboundSmsButton';
import OutboundCallButton from 'containers/OutboundInteractionButton/OutboundCallButton';

import { setNewInteractionPanelFormInput } from 'containers/AgentDesktop/actions';
import { selectNewInteractionPanel } from 'containers/AgentDesktop/selectors';
import {
  getSelectedOutboundEmailIdentifier,
  getSelectedOutboundPhoneIdentifier,
} from 'containers/OutboundAniSelect/selectors';
import {
  selectOutboundPhoneIdentification,
  selectOutboundEmailIdentification,
} from 'containers/OutboundAniSelect/actions';

import messages from './messages';

const styles = {
  base: {
    paddingTop: '50px',
    paddingLeft: '20px',
    width: '100%',
    textAlign: 'center',
  },
  creatingNewInteractionFor: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    textAlign: 'center',
  },
  hr: {
    width: '50%',
    margin: '30px 25%',
  },
  outboundAniDiv: {
    margin: '0px auto 10px',
    width: '282px',
  },
};

const formatPhoneNumber = input => {
  const formattedInput = input.replace(/\D+/g, '');
  if (isValidNumber(`+${formattedInput}`)) {
    // Check if it's a valid number
    return `+${formattedInput}`;
  } else if (isValidNumber(`+1${formattedInput}`)) {
    // Check if it's valid with "1" pre-pended
    return `+1${formattedInput}`;
  } else if (isValidNumber(`+44${formattedInput}`)) {
    // Check if it's valid with "44" pre-pended
    return `+44${formattedInput}`;
  } else if (isPossibleNumber(`+${formattedInput}`)) {
    // Check if it's a possible number
    return `+${formattedInput}`;
  } else if (isPossibleNumber(`+1${formattedInput}`)) {
    // Check if it's possible number with "1" pre-pended
    return `+1${formattedInput}`;
  } else if (isPossibleNumber(`+44${formattedInput}`)) {
    // Check if it's possible number with "44" pre-pended
    return `+44${formattedInput}`;
  } else {
    return formattedInput;
  }
};

export function NewInteractionForm(props) {
  return (
    <div style={styles.base}>
      {props.uriObject !== undefined && (
        <div style={styles.creatingNewInteractionFor}>
          <FormattedMessage
            {...messages.creatingNewInteractionFor}
            values={{ objectName: props.uriObject.objectName }}
          />
        </div>
      )}
      <TextInput
        id="newInteractionFormInput"
        cb={props.setNewInteractionPanelFormInput}
        value={props.input}
        style={styles.input}
        placeholder={messages.newInteractionFormInstructions}
        autoFocus
      />
      <hr style={styles.hr} />
      <div style={styles.outboundAniDiv}>
        <OutboundAniSelect
          channelTypes={
            isPossibleNumber(formatPhoneNumber(props.input))
              ? ['voice', 'sms']
              : ['email']
          }
          changeSelected={
            isPossibleNumber(formatPhoneNumber(props.input))
              ? props.selectOutboundPhoneIdentification
              : props.selectOutboundEmailIdentification
          }
          valueSelected={
            isPossibleNumber(formatPhoneNumber(props.input))
              ? props.getSelectedOutboundPhoneIdentifier
              : props.getSelectedOutboundEmailIdentifier
          }
        />
      </div>
      {!isValidEmail(props.input) &&
        (!props.getSelectedOutboundPhoneIdentifier ||
          props.getSelectedOutboundPhoneIdentifier.channelType === 'voice' ||
          !isPossibleNumber(formatPhoneNumber(props.input))) && (
        <OutboundCallButton phoneNumber={formatPhoneNumber(props.input)} />
      )}
      {!isValidEmail(props.input) &&
        (!props.getSelectedOutboundPhoneIdentifier ||
          props.getSelectedOutboundPhoneIdentifier.channelType === 'sms' ||
          !isPossibleNumber(formatPhoneNumber(props.input))) && (
        <OutboundSmsButton phoneNumber={formatPhoneNumber(props.input)} />
      )}
      {!isPossibleNumber(formatPhoneNumber(props.input)) && (
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
    getSelectedOutboundEmailIdentifier: getSelectedOutboundEmailIdentifier(
      state,
      props
    ),
    getSelectedOutboundPhoneIdentifier: getSelectedOutboundPhoneIdentifier(
      state,
      props
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setNewInteractionPanelFormInput: input =>
      dispatch(setNewInteractionPanelFormInput(input)),
    selectOutboundPhoneIdentification: input =>
      dispatch(selectOutboundPhoneIdentification(input)),
    selectOutboundEmailIdentification: input =>
      dispatch(selectOutboundEmailIdentification(input)),
    dispatch,
  };
}

NewInteractionForm.propTypes = {
  input: PropTypes.string.isRequired,
  uriObject: PropTypes.shape({
    objectName: PropTypes.string,
  }),
  setNewInteractionPanelFormInput: PropTypes.func.isRequired,
  getSelectedOutboundEmailIdentifier: PropTypes.object,
  getSelectedOutboundPhoneIdentifier: PropTypes.object,
  selectOutboundPhoneIdentification: PropTypes.func.isRequired,
  selectOutboundEmailIdentification: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(NewInteractionForm))
);
