/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Radium from 'radium';
import { isPossibleNumber, isValidEmail } from 'utils/validator';
import { isBeta } from 'utils/url';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import OutboundCallButton from 'containers/OutboundInteractionButton/OutboundCallButton';
import OutboundSmsButton from 'containers/OutboundInteractionButton/OutboundSmsButton';
import OutboundEmailButton from 'containers/OutboundInteractionButton/OutboundEmailButton';
import OutboundAniSelect from 'containers/OutboundAniSelect';

import { getSelectedOutboundIdentifier } from 'containers/OutboundAniSelect/selectors';

import messages from './messages';

const styles = {
  base: {
    paddingLeft: '52px',
  },
  noRecordsMessage: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  outboundInteractionButtons: {
    paddingTop: '30px',
    borderTop: '1px solid #D0D0D0',
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
  createRecordBtn: {
    textAlign: 'center',
  },
};

export class NoRecords extends React.Component {
  getPhoneNumber = () => {
    // If we only have one key that's value is a valid phone number, use it
    if (Object.keys(this.props.query).length === 1) {
      const phoneNumber = this.props.query[Object.keys(this.props.query)[0]];
      if (isPossibleNumber(phoneNumber)) {
        return phoneNumber;
      } else if (isPossibleNumber(`+${phoneNumber}`)) {
        return `+${phoneNumber}`;
      } else if (isPossibleNumber(`+1${phoneNumber}`)) {
        return `+1${phoneNumber}`;
      }
    }
    return undefined;
  };

  getEmailAddress = () => {
    // If we only have one key that's value is a valid email, use it
    if (Object.keys(this.props.query).length === 1) {
      const email = this.props.query[Object.keys(this.props.query)[0]];
      if (isValidEmail(email)) return email;
    }
    return undefined;
  };

  render() {
    return (
      <div style={styles.base}>
        <div style={styles.noRecordsMessage}>
          {'- '}
          <FormattedMessage {...messages.noRecords} />
          {'- '}
        </div>
        {(this.getPhoneNumber() || this.getEmailAddress()) && (
          <div style={styles.outboundInteractionButtons}>
            {this.getPhoneNumber() &&
              isBeta() && <OutboundAniSelect channelTypes="voice" />}
            {this.getPhoneNumber() && (
              <OutboundCallButton phoneNumber={this.getPhoneNumber()} />
            )}
            {this.getPhoneNumber() &&
              !this.props.getSelectedOutboundIdentifier && (
              <OutboundSmsButton phoneNumber={this.getPhoneNumber()} />
            )}
            {this.getEmailAddress() && (
              <OutboundEmailButton email={this.getEmailAddress()} />
            )}
            <div style={styles.orText}>
              <FormattedMessage {...messages.or} />
            </div>
          </div>
        )}
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

NoRecords.propTypes = {
  query: PropTypes.object.isRequired,
  newContact: PropTypes.func.isRequired,
  getSelectedOutboundIdentifier: PropTypes.object,
};

const mapStateToProps = (state, props) => ({
  getSelectedOutboundIdentifier: getSelectedOutboundIdentifier(state, props),
});

export default ErrorBoundary(connect(mapStateToProps)(Radium(NoRecords)));
