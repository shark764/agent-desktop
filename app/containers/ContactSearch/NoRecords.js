/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import { connect } from 'react-redux';
import { isValidNumber } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import Icon from 'components/Icon';

import { startOutboundInteraction } from 'containers/AgentDesktop/actions';
import {
  selectIsAgentReady,
  selectHasVoiceInteraction,
  selectSmsInteractionNumbers,
} from 'containers/AgentDesktop/selectors';
import { getSelectedInteractionIsCreatingNewInteraction } from 'containers/ContactsControl/selectors';

import messages from './messages';

const styles = {
  noRecordsMessage: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  outboundInteractionButtons: {
    paddingTop: '30px',
    borderTop: '1px solid #D0D0D0',
  },
  startInteractionButton: {
    margin: '0 auto 10px',
    width: '300px',
    borderRadius: '2px',
    border: 'solid 1px #979797',
    padding: '10px 15px',
    cursor: 'pointer',
  },
  startInteractionButtonDisabled: {
    color: '#979797',
    cursor: 'default',
  },
  startInteractionText: {
    display: 'inline-block',
  },
  startInteractionIcon: {
    marginRight: '10px',
  },
  startInteractionValue: {
    float: 'right',
  },
  createRecordBtn: {
    textAlign: 'center',
  },
  orText: {
    marginTop: '8px',
    marginBottom: '8px',
    color: '#979797',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1',
  },
};

export class NoRecords extends React.Component {
  constructor(props) {
    super(props);
    // If we only have one key that's value is a valid phone number, set it in state so we can render the outbound buttons
    if (
      Object.keys(props.query).length === 1 &&
      isValidNumber(props.query[Object.keys(props.query)[0]])
    ) {
      this.state = {
        phoneNumber: props.query[Object.keys(props.query)[0]],
      };
    }
  }

  startCall = () => {
    if (this.state.phoneNumber) {
      if (this.props.isAgentReady && !this.props.hasVoiceInteraction) {
        this.props.startOutboundInteraction(
          'voice',
          this.state.phoneNumber,
          undefined,
          this.props.selectedInteractionIsCreatingNewInteraction
        );
        CxEngage.interactions.voice.dial({
          phoneNumber: this.state.phoneNumber,
        });
      }
    } else {
      throw new Error('Invalid call to startCall(). No phoneNumber in state.');
    }
  };

  startSms = () => {
    if (this.state.phoneNumber) {
      if (
        this.props.isAgentReady &&
        !this.props.smsInteractionNumbers.includes(this.state.phoneNumber)
      ) {
        this.props.startOutboundInteraction(
          'sms',
          this.state.phoneNumber,
          undefined,
          this.props.selectedInteractionIsCreatingNewInteraction
        );
      }
    } else {
      throw new Error('Invalid call to startSms(). No phoneNumber in state.');
    }
  };

  render() {
    let outboundInteractionButtons;
    if (this.state.phoneNumber) {
      outboundInteractionButtons = (
        <div style={styles.outboundInteractionButtons}>
          <div
            id="callNewInteractionButton"
            onClick={this.startCall}
            style={[
              styles.startInteractionButton,
              (!this.props.isAgentReady || this.props.hasVoiceInteraction) &&
                styles.startInteractionButtonDisabled,
            ]}
          >
            <div style={styles.startInteractionText}>
              <Icon name={'voice_dark'} style={styles.startInteractionIcon} />
              <FormattedMessage {...messages.call} />
            </div>
            <div
              style={[
                styles.startInteractionText,
                styles.startInteractionValue,
              ]}
            >
              {this.state.phoneNumber}
            </div>
          </div>
          <div
            id="smsNewInteractionButton"
            onClick={this.startSms}
            style={[
              styles.startInteractionButton,
              (!this.props.isAgentReady ||
                this.props.smsInteractionNumbers.includes(
                  this.state.phoneNumber
                )) &&
                styles.startInteractionButtonDisabled,
            ]}
          >
            <div style={styles.startInteractionText}>
              <Icon name={'message_dark'} style={styles.startInteractionIcon} />
              <FormattedMessage {...messages.sms} />
            </div>
            <div
              style={[
                styles.startInteractionText,
                styles.startInteractionValue,
              ]}
            >
              {this.state.phoneNumber}
            </div>
          </div>
          <div style={styles.orText}>
            <FormattedMessage {...messages.or} />
          </div>
        </div>
      );
    }
    return (
      <div style={{ paddingLeft: '52px' }}>
        <div style={styles.noRecordsMessage}>
          - <FormattedMessage {...messages.noRecords} /> -
        </div>
        {outboundInteractionButtons}
        <div style={styles.createRecordBtn}>
          <Button
            id="createNewRecord"
            type="secondary"
            text={messages.createRecord}
            onClick={this.props.newContact}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isAgentReady: selectIsAgentReady(state, props),
  hasVoiceInteraction: selectHasVoiceInteraction(state, props),
  smsInteractionNumbers: selectSmsInteractionNumbers(state, props),
  selectedInteractionIsCreatingNewInteraction: getSelectedInteractionIsCreatingNewInteraction(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    startOutboundInteraction: (
      channelType,
      customer,
      contact,
      addedByNewInteractionPanel
    ) =>
      dispatch(
        startOutboundInteraction(
          channelType,
          customer,
          contact,
          addedByNewInteractionPanel
        )
      ),
    dispatch,
  };
}

NoRecords.propTypes = {
  query: PropTypes.object.isRequired,
  newContact: PropTypes.func.isRequired,
  isAgentReady: PropTypes.bool.isRequired,
  hasVoiceInteraction: PropTypes.bool.isRequired,
  smsInteractionNumbers: PropTypes.array.isRequired,
  selectedInteractionIsCreatingNewInteraction: PropTypes.bool.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(NoRecords))
);
