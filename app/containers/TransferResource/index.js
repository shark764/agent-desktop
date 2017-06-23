/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * TransferResource
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Icon from 'components/Icon';
import Timer from 'components/Timer';

import messages from './messages';

export class TransferResource extends BaseComponent {
  resourceControlsMenuToggle = () => {
    if (
      this.props.selectedTransferResourceMenu !==
      this.props.resource.targetResource
    ) {
      this.props.setSelectedTransferResourceMenu(
        this.props.resource.targetResource
      );
    } else {
      this.props.setSelectedTransferResourceMenu(undefined);
    }
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
    this.props.setSelectedTransferResourceMenu(undefined);
  };

  holdResource = () => {
    CxEngage.interactions.voice.resourceHold({
      interactionId: this.props.activeVoiceInteraction.interactionId,
      targetResourceId: this.props.resource.targetResource,
    });
    this.props.setSelectedTransferResourceMenu(undefined);
  };

  resumeResource = () => {
    CxEngage.interactions.voice.resourceResume({
      interactionId: this.props.activeVoiceInteraction.interactionId,
      targetResourceId: this.props.resource.targetResource,
    });
    this.props.setSelectedTransferResourceMenu(undefined);
  };

  resumeAll = () => {
    CxEngage.interactions.voice.resumeAll({
      interactionId: this.props.activeVoiceInteraction.interactionId,
    });
    this.props.setSelectedTransferResourceMenu(undefined);
  };

  transfer = () => {
    CxEngage.interactions.voice.transferToResource({
      transferType: 'cold',
      interactionId: this.props.activeVoiceInteraction.interactionId,
      resourceId: this.props.resource.targetResource,
    });
    this.props.setSelectedTransferResourceMenu(undefined);
  };

  styles = {
    warmTransfer: {
      padding: '4px 23px',
      fontSize: '15px',
      fontWeight: 600,
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
      margin: '0 15px 6px 0',
    },
    transferConnectedIcon: {
      backgroundColor: '#23CEF5',
    },
    transferConnected: {
      maxWidth: '160px',
    },
    transferConnectedWithStatus: {
      maxWidth: '110px',
    },
    transferName: {
      maxWidth: '100px',
      marginRight: '5px',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    transferStatus: {
      fontSize: '12px',
      display: 'inline-block',
      verticalAlign: 'top',
      marginTop: '2px',
    },
    resourceControlsMenuToggle: {
      display: 'inline-block',
      float: 'right',
      fontSize: '11px',
      margin: '3px -4px 0 4px',
      cursor: 'pointer',
    },
    transferTimer: {
      float: 'right',
      fontSize: '14px',
      fontWeight: 'normal',
    },
    topTriangle: {
      marginTop: '-14px',
      marginLeft: '251px',
    },
    phoneControlsPopupMenu: {
      width: '110px',
      margin: '-7px 0 0 200px',
      padding: '12px',
    },
    phoneControlsPopupMenuOption: {
      cursor: 'pointer',
      padding: '0 3px',
      ':hover': {
        backgroundColor: '#DEF8FE',
      },
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
      <div>
        <div
          id={`transfer-${this.props.resource.type}-${this.props.resource.id}`}
          style={[this.styles.warmTransfer, transferStyle]}
        >
          {icon}
          <span
            title={this.props.resource.name}
            style={[this.styles.transferName, transferStatusStyle]}
          >
            {this.props.resource.name}
          </span>
          {status
            ? <span style={this.styles.transferStatus}>({status})</span>
            : undefined}
          {this.props.resource.status === 'connected'
            ? <div
              className="resourceControlsMenuToggle"
              onClick={this.resourceControlsMenuToggle}
              style={this.styles.resourceControlsMenuToggle}
            >
                &#9660;
              </div>
            : undefined}
          <Timer format="mm:ss" style={this.styles.transferTimer} />
        </div>
        {this.props.resource.targetResource !== undefined &&
          this.props.selectedTransferResourceMenu ===
            this.props.resource.targetResource
          ? <div id="resourceControlsMenu">
            <div
              style={[this.props.style.topTriangle, this.styles.topTriangle]}
            />
            <div
              style={[
                this.props.style.phoneControlsPopupMenu,
                this.styles.phoneControlsPopupMenu,
              ]}
            >
              {this.props.resource.onHold !== true
                  ? <div
                    id="holdResource"
                    key="holdResource"
                    title={this.props.intl.formatMessage(
                        messages.holdDescription
                      )}
                    onClick={this.holdResource}
                    style={this.styles.phoneControlsPopupMenuOption}
                  >
                    <FormattedMessage {...messages.hold} />
                  </div>
                  : <div>
                    <div
                      id="resumeResource"
                      key="resumeResource"
                      title={this.props.intl.formatMessage(
                          messages.resumeDescription
                        )}
                      onClick={this.resumeResource}
                      style={this.styles.phoneControlsPopupMenuOption}
                    >
                      <FormattedMessage {...messages.resume} />
                    </div>
                    {this.props.resumeAllAvailable
                        ? <div
                          id="resumeAll"
                          key="resumeAll"
                          title={this.props.intl.formatMessage(
                              messages.resumeAllDescription
                            )}
                          onClick={this.resumeAll}
                          style={this.styles.phoneControlsPopupMenuOption}
                        >
                          <FormattedMessage {...messages.resumeAll} />
                        </div>
                        : undefined}
                  </div>}
              <div
                id="transferResource"
                key="transferResource"
                title={this.props.intl.formatMessage(
                    messages.transferDescription
                  )}
                onClick={this.transfer}
                style={this.styles.phoneControlsPopupMenuOption}
              >
                <FormattedMessage {...messages.transfer} />
              </div>
              <div
                id="hangUpResource"
                key="hangUpResource"
                title={this.props.intl.formatMessage(
                    messages.hangUpDescription
                  )}
                onClick={this.hangUpResource}
                style={this.styles.phoneControlsPopupMenuOption}
              >
                <FormattedMessage {...messages.hangUp} />
              </div>
            </div>
          </div>
          : undefined}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    dispatch,
  };
}

TransferResource.propTypes = {
  intl: intlShape.isRequired,
  activeVoiceInteraction: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  resumeAllAvailable: PropTypes.bool.isRequired,
  selectedTransferResourceMenu: PropTypes.string,
  setSelectedTransferResourceMenu: PropTypes.func.isRequired,
  style: PropTypes.shape({
    topTriangle: PropTypes.object.isRequired,
    phoneControlsPopupMenu: PropTypes.object.isRequired,
  }).isRequired,
};

export default injectIntl(
  connect(null, mapDispatchToProps)(Radium(TransferResource))
);
