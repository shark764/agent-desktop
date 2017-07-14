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
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Toggle from 'react-toggle';
import 'assets/css/react-toggle-style.css';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';

import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';
import { selectAgentId } from 'containers/AgentDesktop/selectors';
import TransferMenu from 'containers/TransferMenu';
import TransferResource from 'components/TransferResource';

import messages from './messages';

export class PhoneControlsActive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTransferMenu: false,
      selectedTransferResourceMenu: undefined,
      showActiveInteractionDialpad: false,
      activeInteractionDialpadText: '',
    };
  }

  setSelectedTransferResourceMenu = (selectedTransferResourceMenu) => {
    this.setState({ selectedTransferResourceMenu });
  };

  setShowTransferMenu = (showTransferMenu) => {
    this.setState({
      showTransferMenu,
      showActiveInteractionDialpad: false,
    });
  };

  setShowActiveInteractionDialpad = (showActiveInteractionDialpad) => {
    this.setState({
      showActiveInteractionDialpad,
      showTransferMenu: false,
    });
  };

  setActiveInteractionDialpadText = (activeInteractionDialpadText) => {
    this.setState({ activeInteractionDialpadText });
  };

  setRecording = () => {
    if (this.props.activeVoiceInteraction.recording) {
      CxEngage.interactions.voice.stopRecording({
        interactionId: this.props.activeVoiceInteraction.interactionId,
      });
    } else {
      CxEngage.interactions.voice.startRecording({
        interactionId: this.props.activeVoiceInteraction.interactionId,
      });
    }
  };

  endInteraction = () => {
    CxEngage.interactions.end({
      interactionId: this.props.activeVoiceInteraction.interactionId,
    });
  };

  setMute = () => {
    if (this.props.activeVoiceInteraction.muted) {
      CxEngage.interactions.voice.unmute({
        interactionId: this.props.activeVoiceInteraction.interactionId,
        targetResourceId: this.props.agentId,
      });
    } else {
      CxEngage.interactions.voice.mute({
        interactionId: this.props.activeVoiceInteraction.interactionId,
        targetResourceId: this.props.agentId,
      });
    }
  };

  setHold = () => {
    if (this.props.activeVoiceInteraction.onHold) {
      CxEngage.interactions.voice.customerResume({
        interactionId: this.props.activeVoiceInteraction.interactionId,
      });
    } else {
      CxEngage.interactions.voice.customerHold({
        interactionId: this.props.activeVoiceInteraction.interactionId,
      });
    }
  };

  toggleDialpad = () => {
    this.setShowActiveInteractionDialpad(
      !this.state.showActiveInteractionDialpad
    );
  };

  toggleTransferMenu = () => {
    this.setShowTransferMenu(!this.state.showTransferMenu);
  };

  resumeMe = () => {
    CxEngage.interactions.voice.resourceResume({
      interactionId: this.props.activeVoiceInteraction.interactionId,
      targetResourceId: this.props.agentId,
    });
  };

  styles = {
    base: {
      padding: '6px 0 12px',
    },
    recordingContainer: {
      padding: '0 12px 14px',
    },
    recordingText: {
      fontSize: '14px',
    },
    toggleRecordingLabel: {
      fontSize: '12px',
      verticalAlign: 'top',
      lineHeight: '21px',
      marginRight: '3px',
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
    activeVoiceInteractionDialpadTopTriangle: {
      marginLeft: '219px',
    },
    mask: {
      position: 'fixed',
      top: '0px',
      left: '0px',
      height: '100vh',
      width: '100vw',
      zIndex: '2',
    },
    transferTopTriangle: {
      marginLeft: '177px',
      borderBottom: '10px solid #F3F3F3',
    },
    activeVoiceInteractionDialpadPhoneControlsPopupMenu: {
      height: '339px',
    },
    transferPhoneControlsPopupMenu: {
      padding: 0,
      fontSize: '14px',
    },
    meOnHold: {
      width: '255px',
      margin: '12px 14px 0',
      padding: '5px',
      borderRadius: '9px',
      textAlign: 'center',
    },
    warmTransfersContainer: {
      marginTop: '7px',
    },
  };

  render() {
    let recordingContainer;
    if (this.props.activeVoiceInteraction.agentRecordingEnabled) {
      recordingContainer = (
        <div id="recordingContainer" style={this.styles.recordingContainer}>
          <span style={this.styles.recordingText}>
            <FormattedMessage {...messages.recording} />
          </span>
          <span
            style={{
              float: 'right',
              verticalAlign: 'top',
              height: 20,
              marginTop: 2,
            }}
          >
            <label
              htmlFor="toggleRecording"
              style={this.styles.toggleRecordingLabel}
            >
              {this.props.activeVoiceInteraction.recording
                ? <FormattedMessage {...messages.on} />
                : <FormattedMessage {...messages.off} />}
            </label>
            <Toggle
              id="toggleRecording"
              icons={false}
              onChange={this.setRecording}
              checked={this.props.activeVoiceInteraction.recording}
            />
          </span>
        </div>
      );
    } else {
      recordingContainer = <div style={{ height: '6px', width: '100%' }} />;
    }

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
        (warmTransfer, index) =>
          // the index being appended to the key is a temporary anti-pattern to protect us from
          // duplicate keys now that queues and resource ID's both live in the props,
          // will be addressed by CXV1-8563
          <TransferResource
            key={`${warmTransfer.targetResource
              ? warmTransfer.targetResource
              : warmTransfer.id}_${index}`}
            activeVoiceInteraction={this.props.activeVoiceInteraction}
            resource={warmTransfer}
            resumeAllAvailable={resourcesOnHold > 1}
            selectedTransferResourceMenu={
              this.state.selectedTransferResourceMenu
            }
            setSelectedTransferResourceMenu={
              this.setSelectedTransferResourceMenu
            }
            style={this.props.style}
          />
      );
      warmTransfers = (
        <div style={this.styles.warmTransfersContainer}>
          {warmTransfersMapped}
        </div>
      );
    }

    return (
      <div style={this.styles.base}>
        {recordingContainer}
        <div style={this.styles.bottonRowContainer}>
          <div style={this.styles.center}>
            <CircleIconButton
              id="endCallButton"
              name="endCall"
              onClick={this.endInteraction}
              style={this.styles.circleIconButtonRow}
            />
            {this.props.activeVoiceInteraction.status !== 'fatal'
              ? <span>
                {this.props.activeVoiceInteraction.meOnHold !== true &&
                <CircleIconButton
                  id="muteButton"
                  name="mute"
                  active={this.props.activeVoiceInteraction.muted}
                  onClick={this.setMute}
                  style={this.styles.circleIconButtonRow}
                />}
                <CircleIconButton
                  id="holdButton"
                  name="hold"
                  active={this.props.activeVoiceInteraction.onHold}
                  onClick={this.setHold}
                  style={this.styles.circleIconButtonRow}
                />
                {!connectingTransfers &&
                <CircleIconButton
                  id="transferButton"
                  name="transfer"
                  active={this.state.showTransferMenu}
                  onClick={this.toggleTransferMenu}
                  style={this.styles.circleIconButtonRow}
                />}
                {this.props.activeExtension.type !== 'pstn' &&
                <CircleIconButton
                  id="dialpadButton"
                  name="dialpad"
                  active={this.state.showActiveInteractionDialpad}
                  onClick={this.toggleDialpad}
                  style={this.styles.circleIconButtonRow}
                />}
              </span>
              : undefined}
          </div>
        </div>
        {this.state.showTransferMenu && !connectingTransfers
          ? <div>
            <div
              id="transferMask"
              style={this.styles.mask}
              onClick={this.toggleTransferMenu}
            />
            <div
              style={[
                this.props.style.topTriangle,
                this.styles.transferTopTriangle,
              ]}
            />
            <div
              id="transfersContainer"
              style={[
                this.props.style.phoneControlsPopupMenu,
                this.styles.transferPhoneControlsPopupMenu,
              ]}
            >
              <TransferMenu
                interactionId={
                    this.props.activeVoiceInteraction.interactionId
                  }
                setShowTransferMenu={this.setShowTransferMenu}
              />
            </div>
          </div>
          : undefined}
        {this.state.showActiveInteractionDialpad
          ? <Dialpad
            id="activeInteractionDialpad"
            interactionId={this.props.activeVoiceInteraction.interactionId}
            setDialpadText={this.setActiveInteractionDialpadText}
            dialpadText={this.state.activeInteractionDialpadText}
            inCall
            toggle={this.toggleDialpad}
            active
            transfer={false}
          />
          : undefined}
        {this.props.activeVoiceInteraction.meOnHold === true
          ? <Button
            id="agentOnHoldButton"
            text={messages.onHold}
            mouseOverText={messages.resume}
            type="primaryRed"
            onClick={this.resumeMe}
            style={this.styles.meOnHold}
          />
          : undefined}
        {warmTransfers}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  agentId: selectAgentId(state, props),
  activeExtension: selectActiveExtension(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

PhoneControlsActive.propTypes = {
  agentId: PropTypes.string.isRequired,
  activeVoiceInteraction: PropTypes.object,
  activeExtension: PropTypes.object,
  style: PropTypes.shape({
    topTriangle: PropTypes.object.isRequired,
    phoneControlsPopupMenu: PropTypes.object.isRequired,
  }),
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(PhoneControlsActive))
);
