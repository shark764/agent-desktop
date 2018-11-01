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
import { getSelectedOutboundIdentifier } from 'containers/OutboundAniSelect/selectors';
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

  startCall = () => {
    if (this.isEnabled()) {
      if (this.props.channelType === 'email') {
        this.props.startOutboundEmail(
          this.props.endpoint,
          undefined,
          this.props.selectedInteractionIsCreatingNewInteraction
        );
      } else {
        let popUri;
        let outboundIdentifier;
        let flowId;
        if (this.props.uriObject !== undefined) {
          ({ popUri } = this.props.uriObject);
        }
        if (this.props.getSelectedOutboundIdentifier) {
          ({
            outboundIdentifier,
            flowId,
          } = this.props.getSelectedOutboundIdentifier);
        }

        const outboundVoiceObject = { phoneNumber: this.props.endpoint };

        if (popUri) {
          outboundVoiceObject.popUri = popUri;
        }
        if (outboundIdentifier && flowId) {
          outboundVoiceObject.outboundAni = outboundIdentifier;
          outboundVoiceObject.flowId = flowId;
        }

        this.props.startOutboundInteraction(
          this.props.channelType,
          this.props.endpoint,
          undefined,
          this.props.selectedInteractionIsCreatingNewInteraction,
          undefined,
          undefined,
          popUri,
          this.props.getSelectedOutboundIdentifier
        );

        if (this.props.channelType === 'voice') {
          CxEngage.interactions.voice.dial(outboundVoiceObject);
        }
      }
    }
  };

  render() {
    return (
      <Button
        id={`${this.props.channelType}NewInteractionButton`}
        type="secondary"
        onClick={this.startCall}
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
  getSelectedOutboundIdentifier: getSelectedOutboundIdentifier(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    startOutboundInteraction: (
      channelType,
      customer,
      contact,
      addedByNewInteractionPanel,
      interactionId,
      openSidePanel,
      popUri,
      selectedOutboundAni
    ) =>
      dispatch(
        startOutboundInteraction(
          channelType,
          customer,
          contact,
          addedByNewInteractionPanel,
          interactionId,
          openSidePanel,
          popUri,
          selectedOutboundAni
        )
      ),
    startOutboundEmail: (customer, contact, addedByNewInteractionPanel) =>
      dispatch(
        startOutboundEmail(customer, contact, addedByNewInteractionPanel)
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
  getSelectedOutboundIdentifier: PropTypes.object,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(OutboundInteractionButton))
);
