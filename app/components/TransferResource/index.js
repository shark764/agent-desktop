/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * TransferResource
 *
 */

import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import CircleIconButton from 'components/CircleIconButton';
import Icon from 'components/Icon';
import Timer from 'components/Timer';

import messages from './messages';

export class TransferResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceHovered: false,
    };
  }

  setResourceHovered = () => {
    this.setState({ resourceHovered: true });
  };

  setResourceUnhovered = () => {
    this.setState({ resourceHovered: false });
  };

  cancelTransfer = (warmTransfer) => {
    if (warmTransfer.type === 'agent') {
      CxEngage.interactions.voice.cancelResourceTransfer({
        transferType: 'warm',
        interactionId: this.props.activeVoiceInteraction.interactionId,
        transferResourceId: warmTransfer.id,
      });
    } else if (warmTransfer.type === 'queue') {
      CxEngage.interactions.voice.cancelQueueTransfer({
        transferType: 'warm',
        interactionId: this.props.activeVoiceInteraction.interactionId,
        transferQueueId: warmTransfer.id,
      });
    } else if (warmTransfer.type === 'transferExtension') {
      CxEngage.interactions.voice.cancelExtensionTransfer({
        transferType: 'warm',
        interactionId: this.props.activeVoiceInteraction.interactionId,
        transferExtension: warmTransfer.id,
      });
    } else {
      throw new Error(`Unhandled transfer type: ${warmTransfer.type}`);
    }
  };

  hangUpResource = () => {
    CxEngage.interactions.voice.resourceRemove({
      interactionId: this.props.activeVoiceInteraction.interactionId,
      targetResourceId: this.props.resource.targetResource,
    });
  };

  holdResource = () => {
    if (this.props.resource.onHold !== true) {
      CxEngage.interactions.voice.resourceHold({
        interactionId: this.props.activeVoiceInteraction.interactionId,
        targetResourceId: this.props.resource.targetResource,
      });
    } else {
      CxEngage.interactions.voice.resourceResume({
        interactionId: this.props.activeVoiceInteraction.interactionId,
        targetResourceId: this.props.resource.targetResource,
      });
    }
  };

  transfer = () => {
    CxEngage.interactions.voice.transferToResource({
      transferType: 'cold',
      interactionId: this.props.activeVoiceInteraction.interactionId,
      resourceId: this.props.resource.targetResource,
    });
  };

  styles = {
    warmTransfer: {
      padding: '10px 23px 8px',
      fontSize: '15px',
      fontWeight: 600,
      ':hover': {
        backgroundColor: '#DEF8FE',
      },
    },
    transferInProgress: {
      color: '#979797',
    },
    cancelTransfer: {
      verticalAlign: 'top',
      display: 'inline-block',
      marginRight: '13px',
      cursor: 'pointer',
    },
    transferStatusIcon: {
      height: '8px',
      width: '8px',
      borderRadius: '4px',
      display: 'inline-block',
      margin: '8px 15px 0 0',
      verticalAlign: 'top',
    },
    transferConnectedIcon: {
      backgroundColor: '#23CEF5',
    },
    transferConnected: {
      maxWidth: '185px',
    },
    transferConnectedWithStatus: {
      maxWidth: '135px',
    },
    transferName: {
      maxWidth: '110px',
      margin: '2px 5px 0 0',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    transferStatus: {
      fontSize: '12px',
      display: 'inline-block',
      verticalAlign: 'top',
      marginTop: '4px',
    },
    resourceControlsMenu: {
      float: 'right',
    },
    transferTimer: {
      float: 'right',
      fontSize: '14px',
      fontWeight: 'normal',
      marginTop: '2px',
    },
    phoneControlsButton: {
      marginLeft: '4px',
    },
  };

  render() {
    let status;
    let transferStyle;
    let transferStatusStyle;
    let icon;
    if (this.props.resource.status === 'transferring') {
      icon = (
        <span
          title={this.props.intl.formatMessage(messages.cancelTransfer)}
          onClick={() => this.cancelTransfer(this.props.resource)}
          style={this.styles.cancelTransfer}
        >
          <Icon name="close" />
        </span>
      );
      status = <FormattedMessage {...messages.connecting} />;
      transferStyle = this.styles.transferInProgress;
    } else if (this.props.resource.status === 'connected') {
      icon = (
        <div
          style={[
            this.styles.transferStatusIcon,
            this.styles.transferConnectedIcon,
          ]}
        />
      );
      if (this.props.resource.onHold === true) {
        status = <FormattedMessage {...messages.onHold} />;
        transferStatusStyle = this.styles.transferConnectedWithStatus;
      } else if (this.props.resource.muted === true) {
        status = <FormattedMessage {...messages.muted} />;
        transferStatusStyle = this.styles.transferConnectedWithStatus;
      } else {
        transferStatusStyle = this.styles.transferConnected;
      }
    } else {
      throw new Error(
        `transfer status not valid: ${this.props.resource.status}`
      );
    }
    return (
      <div
        id={`transfer-${this.props.resource.type}-${this.props.resource.id}`}
        onMouseEnter={this.setResourceHovered}
        onMouseLeave={this.setResourceUnhovered}
        style={[this.styles.warmTransfer, transferStyle]}
      >
        {icon}
        <span
          title={this.props.resource.name}
          style={[this.styles.transferName, transferStatusStyle]}
        >
          {this.props.resource.name}
        </span>
        {status &&
          <span style={this.styles.transferStatus}>
            ({status})
          </span>}
        {this.props.resource.targetResource !== undefined &&
        this.state.resourceHovered
          ? <span
            id="resourceControlsMenu"
            style={this.styles.resourceControlsMenu}
          >
            <CircleIconButton
              id="hangUpResource"
              name="end_call_resource"
              onClick={this.hangUpResource}
              style={this.styles.phoneControlsButton}
            />
            <CircleIconButton
              id="holdResource"
              name="hold_resource"
              active={this.props.resource.onHold}
              onClick={this.holdResource}
              style={this.styles.phoneControlsButton}
            />
            <CircleIconButton
              id="transferResource"
              name="transfer_resource"
              onClick={this.transfer}
              style={this.styles.phoneControlsButton}
            />
          </span>
          : <Timer
            format="mm:ss"
            style={this.styles.transferTimer}
            timeSince={this.props.resource.addedTimestamp}
          />}
      </div>
    );
  }
}

TransferResource.propTypes = {
  intl: intlShape.isRequired,
  activeVoiceInteraction: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
};

export default ErrorBoundary(injectIntl(Radium(TransferResource)));
