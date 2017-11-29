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
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Toggle from 'react-toggle';
import 'assets/css/react-toggle-style.css';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';

import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';
import {
  selectAgentId,
  selectQueuesSet,
} from 'containers/AgentDesktop/selectors';
import TransferMenu from 'containers/TransferMenu';
import TransferResource from 'components/TransferResource';
import { setInteractionConfirmation } from 'containers/AgentDesktop/actions';

import messages from './messages';

export class PhoneControlsActive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTransferMenu: false,
      showActiveInteractionDialpad: false,
      activeInteractionDialpadText: '',
      // showActiveResourcesMenu is the flag to show the menu of all active resources on the call (only used for toolbarMode)
      showActiveResourcesMenu: false,
    };
  }

  setShowTransferMenu = (showTransferMenu) => {
    this.setState({
      showTransferMenu,
      showActiveInteractionDialpad: false,
    });
  };

  setActiveInteractionDialpadText = (activeInteractionDialpadText) => {
    this.setState({ activeInteractionDialpadText });
  };

  toggleDialpad = () => {
    this.setState({
      showActiveInteractionDialpad: !this.state.showActiveInteractionDialpad,
    });
  };

  toggleTransferMenu = () => {
    if (!this.props.queuesSet) {
      CxEngage.entities.getQueues();
    }
    this.setShowTransferMenu(!this.state.showTransferMenu);
  };

  toggleActiveResourcesMenu = () => {
    this.setState({
      showActiveResourcesMenu: !this.state.showActiveResourcesMenu,
    });
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

  confirmEndInteraction = () => {
    if (this.props.activeVoiceInteraction.status === 'fatal') {
      CxEngage.interactions.end({
        interactionId: this.props.activeVoiceInteraction.interactionId,
      });
    } else {
      this.props.setInteractionConfirmation(
        this.props.activeVoiceInteraction.interactionId,
        true
      );
    }
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
    toolbarBase: {
      padding: '9px 0 0 0',
    },
    recordingContainer: {
      padding: '0 12px 14px',
    },
    recordingContainerToolbar: {
      position: 'absolute',
      right: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
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
    transferTopTriangle: {
      borderBottom: '10px solid #F3F3F3',
    },
    activeVoiceInteractionDialpadPhoneControlsPopupMenu: {
      height: '339px',
    },
    transferPhoneControlsPopupMenu: {
      width: '282px',
      marginTop: '10px',
      backgroundColor: '#FFFFFF',
      color: '#4B4B4B',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.23)',
      borderRadius: '3px',
      overflow: 'hidden',
      position: 'absolute',
      zIndex: 3,
      fontSize: '14px',
      left: '-119px',
    },
    transferPhoneControlsPopupMenuToolbar: {
      left: 0,
      width: '100%',
      borderRadius: 0,
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

  renderDialpad = (showDialpad) => {
    if (showDialpad) {
      return (
        <Dialpad
          id="activeInteractionDialpad"
          interactionId={this.props.activeVoiceInteraction.interactionId}
          setDialpadText={this.setActiveInteractionDialpadText}
          dialpadText={this.state.activeInteractionDialpadText}
          inCall
          toggle={this.toggleDialpad}
          transfer={false}
          dialpadPosition={this.props.dialpadPosition}
        />
      );
    }
    return null;
  };

  renderTopTriangle = () => <div style={this.styles.topTriangle} />;

  renderTopTriangleTransferMenu = () => (
    <div style={[this.styles.topTriangle, this.styles.transferTopTriangle]} />
  );

  renderTransferMenu = () => (
    <span>
      <div
        id="transferMask"
        style={this.styles.mask}
        onClick={this.toggleTransferMenu}
      />
      {!this.context.toolbarMode && this.renderTopTriangleTransferMenu()}
      <div
        id="transfersContainer"
        style={[
          this.styles.transferPhoneControlsPopupMenu,
          this.context.toolbarMode &&
            this.styles.transferPhoneControlsPopupMenuToolbar,
        ]}
      >
        <TransferMenu
          interactionId={this.props.activeVoiceInteraction.interactionId}
          setShowTransferMenu={this.setShowTransferMenu}
        />
      </div>
    </span>
  );

  renderTransferMenuTypes = (forIcon) => {
    if (this.state.showTransferMenu) {
      if (forIcon && this.context.toolbarMode) {
        return this.renderTopTriangleTransferMenu();
      } else {
        return this.renderTransferMenu();
      }
    } else {
      return null;
    }
  };

  render() {
    let recordingContainer;
    if (this.props.activeVoiceInteraction.agentRecordingEnabled) {
      if (this.context.toolbarMode) {
        recordingContainer = (
          <div
            id="recordingContainer"
            style={this.styles.recordingContainerToolbar}
          >
            <div>
              <FormattedMessage {...messages.rec} />
            </div>
            <Toggle
              id="toggleRecording"
              icons={false}
              onChange={this.setRecording}
              checked={this.props.activeVoiceInteraction.recording}
            />
          </div>
        );
      } else {
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
                {this.props.activeVoiceInteraction.recording ? (
                  <FormattedMessage {...messages.on} />
                ) : (
                  <FormattedMessage {...messages.off} />
                )}
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
      }
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
        (warmTransfer, index) => (
          // the index being appended to the key is a temporary anti-pattern to protect us from
          // duplicate keys now that queues and resource ID's both live in the props,
          <TransferResource
            key={`${
              warmTransfer.targetResource // eslint-disable-line
                ? warmTransfer.targetResource
                : warmTransfer.id
            }_${index}`}
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
      <div
        style={[
          this.styles.base,
          this.context.toolbarMode &&
            resourcesOnHold &&
            this.styles.toolbarBase,
        ]}
      >
        {recordingContainer}
        <div style={this.styles.bottonRowContainer}>
          <div style={this.styles.center}>
            <CircleIconButton
              id="endCallButton"
              name="endCall"
              onClick={this.confirmEndInteraction}
              style={this.styles.circleIconButtonRow}
            />
            {this.props.activeVoiceInteraction.status !== 'fatal' && (
              <span>
                {this.props.activeVoiceInteraction.meOnHold !== true && (
                  <CircleIconButton
                    id="muteButton"
                    name="mute"
                    active={this.props.activeVoiceInteraction.muted}
                    onClick={this.setMute}
                    style={this.styles.circleIconButtonRow}
                  />
                )}
                <CircleIconButton
                  id="holdButton"
                  name="hold"
                  active={this.props.activeVoiceInteraction.onHold}
                  onClick={this.setHold}
                  style={this.styles.circleIconButtonRow}
                />
                {!connectingTransfers && (
                  <span>
                    <CircleIconButton
                      id="transferButton"
                      name="transfer"
                      active={this.state.showTransferMenu}
                      onClick={this.toggleTransferMenu}
                      style={this.styles.circleIconButtonRow}
                      innerElement={this.renderTransferMenuTypes(true)}
                    />
                    {this.context.toolbarMode && this.renderTransferMenuTypes()}
                  </span>
                )}
                {this.props.activeExtension.type !== 'pstn' && (
                  <CircleIconButton
                    id="dialpadButton"
                    name="dialpad"
                    active={this.state.showActiveInteractionDialpad}
                    onClick={this.toggleDialpad}
                    style={this.styles.circleIconButtonRow}
                    innerElement={this.renderDialpad(
                      this.state.showActiveInteractionDialpad
                    )}
                  />
                )}
                {warmTransfers !== undefined && (
                  <span>
                    <CircleIconButton
                      id="resourcesButton"
                      name="resources"
                      active={this.state.showActiveResourcesMenu}
                      onClick={this.toggleActiveResourcesMenu}
                      style={this.styles.circleIconButtonRow}
                      innerElement={
                        this.state.showActiveResourcesMenu
                          ? this.renderTopTriangle()
                          : null
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
  activeExtension: selectActiveExtension(state, props),
  queuesSet: selectQueuesSet(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setInteractionConfirmation: (interactionId, status) =>
      dispatch(setInteractionConfirmation(interactionId, status)),
    dispatch,
  };
}

PhoneControlsActive.propTypes = {
  intl: intlShape.isRequired,
  agentId: PropTypes.string.isRequired,
  activeVoiceInteraction: PropTypes.object,
  activeExtension: PropTypes.object,
  queuesSet: PropTypes.bool,
  dialpadPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setInteractionConfirmation: PropTypes.func.isRequired,
};

PhoneControlsActive.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Radium(PhoneControlsActive))
  )
);
