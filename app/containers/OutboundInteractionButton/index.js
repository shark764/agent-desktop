/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import Icon from 'components/Icon';

import { startOutboundInteraction } from 'containers/AgentDesktop/actions';
import { startOutboundEmail } from 'containers/EmailContentArea/actions';
import {
  getSelectedOutboundEmailIdentifier,
  getSelectedOutboundPhoneIdentifier,
} from 'containers/OutboundAniSelect/selectors';
import {
  selectIsAgentReady,
  getUriObject,
} from 'containers/AgentDesktop/selectors';
import { getSelectedInteractionIsCreatingNewInteraction } from 'containers/ContactsControl/selectors';

import messages from './messages';

const styles = {
  startInteractionButton: {
    width: '280px',
    margin: '0 auto 10px',
    display: 'block',
    fontSize: '15px',
  },
  startInteractionIcon: {
    marginRight: '10px',
    cursor: 'inherit',
    display: 'inline-block',
    verticalAlign: 'top',
  },
  startInteractionValue: {
    maxWidth: '210px',
    display: 'inline-block',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export class OutboundInteractionButton extends React.Component {
  isEnabled = () => this.props.isAgentReady && this.props.isEnabled;

  getTitle = () => {
    if (!this.props.isAgentReady) {
      return messages.mustBeReady;
    } else {
      return this.props.title;
    }
  };

  getIconName = () => {
    if (this.props.channelType === 'sms') {
      return 'message_dark';
    } else {
      return `${this.props.channelType}_dark`;
    }
  };

  startEmail = () => {
    this.props.startOutboundEmail(
      this.props.endpoint,
      undefined,
      this.props.selectedInteractionIsCreatingNewInteraction,
      this.props.getSelectedOutboundEmailIdentifier
    );
  };

  startSms = () => {
    this.props.startOutboundInteraction({
      channelType: this.props.channelType,
      customer: this.props.endpoint,
      addedByNewInteractionPanel: this.props
        .selectedInteractionIsCreatingNewInteraction,
      popUri: this.props.uriObject ? this.props.uriObject.popUri : undefined,
      selectedOutboundAni: this.props.getSelectedOutboundPhoneIdentifier,
    });
  };

  startCall = () => {
    const { flowId, value, outboundIdentifierListId, outboundIdentifier } =
      this.props.getSelectedOutboundPhoneIdentifier || {};
    const outboundVoiceObject = { phoneNumber: this.props.endpoint };
    if (this.props.uriObject !== undefined) {
      outboundVoiceObject.popUri = this.props.uriObject.popUri;
    }

    if (outboundIdentifier && flowId) {
      outboundVoiceObject.outboundAni = outboundIdentifier;
      outboundVoiceObject.flowId = flowId;
      outboundVoiceObject.outboundIdentifierId = value;
      outboundVoiceObject.outboundIdentifierListId = outboundIdentifierListId;
    }

    this.props.startOutboundInteraction({
      channelType: this.props.channelType,
      customer: this.props.endpoint,
      addedByNewInteractionPanel: this.props
        .selectedInteractionIsCreatingNewInteraction,
      popUri: this.props.uriObject ? this.props.uriObject.popUri : undefined,
      selectedOutboundAni: this.props.getSelectedOutboundPhoneIdentifier,
    });

    CxEngage.interactions.voice.dial(outboundVoiceObject);
  };

  render() {
    return (
      <Button
        id={`${this.props.channelType}NewInteractionButton`}
        type="secondary"
        onClick={
          this.isEnabled() &&
          (() => {
            if (this.props.channelType === 'voice') {
              return this.startCall;
            } else if (this.props.channelType === 'sms') {
              return this.startSms;
            } else if (this.props.channelType === 'email') {
              return this.startEmail;
            }
            return null;
          })()
        }
        title={this.getTitle()}
        style={[
          styles.startInteractionButton,
          !this.isEnabled() && styles.startInteractionButtonDisabled,
        ]}
        disabled={!this.isEnabled()}
      >
        <div>
          <Icon name={this.getIconName()} style={styles.startInteractionIcon} />
          {!this.isEnabled() ? (
            <FormattedMessage {...messages[this.props.channelType]} />
          ) : (
            <span style={styles.startInteractionValue}>
              {this.props.endpoint}
            </span>
          )}
        </div>
      </Button>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isAgentReady: selectIsAgentReady(state, props),
  selectedInteractionIsCreatingNewInteraction: getSelectedInteractionIsCreatingNewInteraction(
    state,
    props
  ),
  uriObject: getUriObject(state, props),
  getSelectedOutboundEmailIdentifier: getSelectedOutboundEmailIdentifier(
    state,
    props
  ),
  getSelectedOutboundPhoneIdentifier: getSelectedOutboundPhoneIdentifier(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    startOutboundInteraction: outboundInteractionData =>
      dispatch(startOutboundInteraction(outboundInteractionData)),
    startOutboundEmail: (
      customer,
      contact,
      addedByNewInteractionPanel,
      outboundAni
    ) =>
      dispatch(
        startOutboundEmail(
          customer,
          contact,
          addedByNewInteractionPanel,
          outboundAni
        )
      ),
    dispatch,
  };
}

OutboundInteractionButton.propTypes = {
  channelType: PropTypes.oneOf(['voice', 'sms', 'email']).isRequired,
  endpoint: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isAgentReady: PropTypes.bool.isRequired,
  selectedInteractionIsCreatingNewInteraction: PropTypes.bool.isRequired,
  uriObject: PropTypes.shape({
    popUri: PropTypes.string.isRequired,
    objectName: PropTypes.string,
  }),
  startOutboundInteraction: PropTypes.func.isRequired,
  startOutboundEmail: PropTypes.func.isRequired,
  getSelectedOutboundEmailIdentifier: PropTypes.object,
  getSelectedOutboundPhoneIdentifier: PropTypes.object,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(OutboundInteractionButton))
);
