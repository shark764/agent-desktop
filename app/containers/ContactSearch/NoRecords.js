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
  outboundAniDiv: {
    margin: '0px auto 10px',
    width: '282px',
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
            {(this.getPhoneNumber() || this.getEmailAddress()) &&
              isBeta() && (
              <div style={styles.outboundAniDiv}>
                <OutboundAniSelect
                  channelTypes={
                    this.getPhoneNumber() ? ['voice', 'sms'] : ['email']
                  }
                  changeSelected={
                    this.getPhoneNumber()
                      ? this.props.selectOutboundPhoneIdentification
                      : this.props.selectOutboundEmailIdentification
                  }
                  valueSelected={
                    this.getPhoneNumber()
                      ? this.props.getSelectedOutboundPhoneIdentifier
                      : this.props.getSelectedOutboundEmailIdentifier
                  }
                  styles={styles.outboundAniDiv}
                />
              </div>
            )}
            {this.getPhoneNumber() &&
              (!this.props.getSelectedOutboundPhoneIdentifier ||
                this.props.getSelectedOutboundPhoneIdentifier.channelType ===
                  'voice') && (
              <OutboundCallButton phoneNumber={this.getPhoneNumber()} />
            )}
            {this.getPhoneNumber() &&
              (!this.props.getSelectedOutboundPhoneIdentifier ||
                this.props.getSelectedOutboundPhoneIdentifier.channelType ===
                  'sms') && (
              <OutboundSmsButton phoneNumber={this.getPhoneNumber()} />
            )}
            {this.getEmailAddress() &&
              (!this.props.getSelectedOutboundEmailIdentifier ||
                this.props.getSelectedOutboundEmailIdentifier.channelType ===
                  'email') && (
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
  selectOutboundPhoneIdentification: PropTypes.func.isRequired,
  selectOutboundEmailIdentification: PropTypes.func.isRequired,
  getSelectedOutboundEmailIdentifier: PropTypes.object,
  getSelectedOutboundPhoneIdentifier: PropTypes.object,
};

export const actions = {
  selectOutboundPhoneIdentification,
  selectOutboundEmailIdentification,
};

const mapStateToProps = (state, props) => ({
  getSelectedOutboundEmailIdentifier: getSelectedOutboundEmailIdentifier(
    state,
    props
  ),
  getSelectedOutboundPhoneIdentifier: getSelectedOutboundPhoneIdentifier(
    state,
    props
  ),
});

export default ErrorBoundary(
  connect(
    mapStateToProps,
    actions
  )(Radium(NoRecords))
);
