/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * PhoneControlsActive
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import { selectAgentId } from 'containers/AgentDesktop/selectors';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import TransferResource from 'components/TransferResource';

import Dialpad from 'containers/PhoneControlsActive/Dialpad';
import EndCall from 'containers/PhoneControlsActive/EndCall';
import Hold from 'containers/PhoneControlsActive/Hold';
import Mute from 'containers/PhoneControlsActive/Mute';
import Recording from 'containers/PhoneControlsActive/Recording';
import Transfer from 'containers/PhoneControlsActive/Transfer';

import messages from './messages';

export class PhoneControlsActive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // showActiveResourcesMenu is the flag to show the menu of all active resources on the call (only used for toolbarMode)
      showActiveResourcesMenu: false,
    };
  }

  toggleActiveResourcesMenu = () => {
    this.setState((prevState) => ({
      showActiveResourcesMenu: !prevState.showActiveResourcesMenu,
    }));
  };

  resumeAll = () => {
    CxEngage.interactions.voice.resumeAll({
      interactionId: this.props.activeVoiceInteraction.interactionId,
    });
  };

  resumeMe = () => {
    CxEngage.interactions.voice.resourceResume({
      interactionId: this.props.activeVoiceInteraction.interactionId,
      targetResourceId: this.props.agentId,
    });
  };

  styles = {
    base: {
      padding: '9px 0',
      position: 'relative',
    },
    bottonRowContainer: {
      height: 40,
      width: '100%',
      display: 'table',
    },
    center: {
      display: 'table-cell',
      verticalAlign: 'middle',
      textAlign: 'center',
    },
    circleIconButtonRow: {
      padding: '0 1.5px',
    },
    mask: {
      position: 'fixed',
      top: '0px',
      left: '0px',
      height: '100vh',
      width: '100vw',
      zIndex: 3,
    },
    topTriangle: {
      width: '0px',
      height: '0px',
      borderTop: 'none',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '10px solid white',
      position: 'absolute',
      marginTop: '4px',
      left: '14px',
      zIndex: 4,
    },
    meOnHold: {
      width: '255px',
      margin: '12px 14px 0',
      padding: '5px',
      borderRadius: '9px',
      textAlign: 'center',
    },
    meOnHoldToolbar: {
      width: '100%',
      margin: 0,
      borderRadius: 0,
      zIndex: 2,
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.37)',
    },
    warmTransfersContainer: {
      position: 'absolute',
      backgroundColor: '#FFFFFF',
      color: '#4B4B4B',
      zIndex: 3,
      marginTop: '10px',
      textAlign: 'left',
      padding: '20px',
      maxHeight: '650px',
      overflowY: 'auto',
      left: '10px',
      width: '400px',
      borderRadius: '3px',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.23)',
    },
    warmTransfersContainerToolbar: {
      left: 0,
      width: '100%',
      borderRadius: 0,
    },
  };

  render() {
    let connectingTransfers = false;
    let resourcesOnHold = this.props.activeVoiceInteraction.onHold ? 1 : 0;
    this.props.activeVoiceInteraction.warmTransfers.forEach((warmTransfer) => {
      if (warmTransfer.status === 'transferring') {
        connectingTransfers = true;
      }
      if (warmTransfer.onHold === true) {
        resourcesOnHold += 1;
      }
    });
    let warmTransfers;
    if (this.props.activeVoiceInteraction.warmTransfers.length > 0) {
      const warmTransfersMapped = this.props.activeVoiceInteraction.warmTransfers.map(
        (warmTransfer, index) => (
          // the index being appended to the key is a temporary anti-pattern to protect us from
          // duplicate keys now that queues and resource ID's both live in the props,
          <TransferResource
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            activeVoiceInteraction={this.props.activeVoiceInteraction}
            resource={warmTransfer}
          />
        )
      );
      warmTransfers = (
        <div
          style={[
            this.styles.warmTransfersContainer,
            this.context.toolbarMode &&
              this.styles.warmTransfersContainerToolbar,
          ]}
        >
          {warmTransfersMapped}
        </div>
      );
    }

    return (
      <div style={this.styles.base}>
        {this.props.activeVoiceInteraction.status !== 'fatal' && (
          <Recording
            interactionId={this.props.activeVoiceInteraction.interactionId}
            isRecording={this.props.activeVoiceInteraction.recording}
            agentRecordingEnabled={
              this.props.activeVoiceInteraction.agentRecordingEnabled
            }
            preventAgentRecordingUpdate={
              this.props.activeVoiceInteraction.callControls
                ? this.props.activeVoiceInteraction.callControls
                  .preventAgentRecordingUpdate
                : false
            }
            isTogglingRecording={
              this.props.activeVoiceInteraction.togglingRecording
            }
          />
        )}
        <div style={this.styles.bottonRowContainer}>
          <div style={this.styles.center}>
            <EndCall
              interactionId={this.props.activeVoiceInteraction.interactionId}
              interactionStatusIsFatal={
                this.props.activeVoiceInteraction.status === 'fatal'
              }
            />
            {this.props.activeVoiceInteraction.status !== 'fatal' && (
              <span>
                <Mute
                  interactionId={
                    this.props.activeVoiceInteraction.interactionId
                  }
                  isMuted={this.props.activeVoiceInteraction.muted}
                  meOnHold={this.props.activeVoiceInteraction.meOnHold}
                  isMuting={this.props.activeVoiceInteraction.isMuting}
                />
                {/* Hide the hold button when we've initiated the call until the customer has connected */}
                {(!this.props.activeVoiceInteraction.initiatedByCurrentAgent ||
                  this.props.activeVoiceInteraction.customerConnected) && (
                  <Hold
                    interactionId={
                      this.props.activeVoiceInteraction.interactionId
                    }
                    isOnHold={this.props.activeVoiceInteraction.onHold}
                    canUpdateHold={
                      this.props.activeVoiceInteraction.callControls
                        ? this.props.activeVoiceInteraction.callControls
                          .holdUpdate
                        : true
                    }
                    isHolding={this.props.activeVoiceInteraction.isHolding}
                  />
                )}
                <Transfer
                  interactionId={
                    this.props.activeVoiceInteraction.interactionId
                  }
                  canTransfer={
                    this.props.activeVoiceInteraction.callControls
                      ? this.props.activeVoiceInteraction.callControls
                        .transferUpdate
                      : true
                  }
                  connectingTransfers={connectingTransfers}
                />
                <Dialpad
                  interactionId={
                    this.props.activeVoiceInteraction.interactionId
                  }
                />
                {warmTransfers !== undefined && (
                  <span>
                    <CircleIconButton
                      id="resourcesButton"
                      name="resources"
                      title={messages.participants}
                      active={this.state.showActiveResourcesMenu}
                      onClick={this.toggleActiveResourcesMenu}
                      style={this.styles.circleIconButtonRow}
                      innerElement={
                        this.state.showActiveResourcesMenu ? (
                          <div style={this.styles.topTriangle} />
                        ) : null
                      }
                    />
                    {this.state.showActiveResourcesMenu && (
                      <div>
                        <div
                          id="activeResourcesMenuMask"
                          style={this.styles.mask}
                          onClick={this.toggleActiveResourcesMenu}
                        />
                        {warmTransfers}
                      </div>
                    )}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        {resourcesOnHold > 1 && (
          <Button
            id="resumeAll"
            text={messages.resumeAll}
            title={this.props.intl.formatMessage(messages.resumeAllDescription)}
            type="primaryRed"
            onClick={this.resumeAll}
            style={[
              this.styles.meOnHold,
              this.context.toolbarMode && this.styles.meOnHoldToolbar,
            ]}
          />
        )}
        {resourcesOnHold <= 1 &&
          this.props.activeVoiceInteraction.meOnHold === true && (
          <Button
            id="agentOnHoldButton"
            text={messages.onHold}
            mouseOverText={messages.resume}
            type="primaryRed"
            onClick={this.resumeMe}
            style={[
              this.styles.meOnHold,
              this.context.toolbarMode && this.styles.meOnHoldToolbar,
            ]}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  agentId: selectAgentId(state, props),
});

PhoneControlsActive.propTypes = {
  intl: intlShape.isRequired,
  agentId: PropTypes.string.isRequired,
  activeVoiceInteraction: PropTypes.object,
};

PhoneControlsActive.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps)(Radium(PhoneControlsActive)))
);
