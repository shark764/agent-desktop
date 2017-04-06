/*
 *
 * PhoneControlsActive
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Toggle from 'react-toggle';
import 'assets/css/react-toggle-style.css';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';

import { selectAgentId } from 'containers/AgentDesktop/selectors';
import TransferMenu from 'containers/TransferMenu';
import TransferResource from 'containers/TransferResource';

import messages from './messages';

export class PhoneControlsActive extends React.Component {
  constructor(props) {
    super(props);
    this.setShowTransferMenu = this.setShowTransferMenu.bind(this);
    this.setShowActiveInteractionDialpad = this.setShowActiveInteractionDialpad.bind(this);
    this.setActiveInteractionDialpadText = this.setActiveInteractionDialpadText.bind(this);
    this.setRecording = this.setRecording.bind(this);
    this.endInteraction = this.endInteraction.bind(this);
    this.setMute = this.setMute.bind(this);
    this.setHold = this.setHold.bind(this);
    this.resumeMe = this.resumeMe.bind(this);

    this.state = {
      showTransferMenu: false,
      showActiveInteractionDialpad: false,
      activeInteractionDialpadText: '',
    };
  }

  setShowTransferMenu(showTransferMenu) {
    this.setState({
      showTransferMenu,
      showActiveInteractionDialpad: false,
    });
  }

  setShowActiveInteractionDialpad(showActiveInteractionDialpad) {
    this.setState({
      showActiveInteractionDialpad,
      showTransferMenu: false,
    });
  }

  setActiveInteractionDialpadText(activeInteractionDialpadText) {
    this.setState({ activeInteractionDialpadText });
  }

  setRecording() {
    if (this.props.activeVoiceInteraction.recording) {
      SDK.interactions.voice.stopRecording({ interactionId: this.props.activeVoiceInteraction.interactionId });
    } else {
      SDK.interactions.voice.startRecording({ interactionId: this.props.activeVoiceInteraction.interactionId });
    }
  }

  endInteraction() {
    SDK.interactions.end({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  setMute() {
    if (this.props.activeVoiceInteraction.muted) {
      SDK.interactions.voice.unmute({ interactionId: this.props.activeVoiceInteraction.interactionId, targetResourceId: this.props.agentId });
    } else {
      SDK.interactions.voice.mute({ interactionId: this.props.activeVoiceInteraction.interactionId, targetResourceId: this.props.agentId });
    }
  }

  setHold() {
    if (this.props.activeVoiceInteraction.onHold) {
      SDK.interactions.voice.customerResume({ interactionId: this.props.activeVoiceInteraction.interactionId });
    } else {
      SDK.interactions.voice.customerHold({ interactionId: this.props.activeVoiceInteraction.interactionId });
    }
  }

  resumeMe() {
    SDK.interactions.voice.resourceResume({ interactionId: this.props.activeVoiceInteraction.interactionId, targetResourceId: this.props.agentId });
  }

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
  }

  render() {
    let recordingContainer;
    if (this.props.activeVoiceInteraction.agentRecordingEnabled) {
      recordingContainer = (
        <div id="recordingContainer" style={this.styles.recordingContainer}>
          <span style={this.styles.recordingText} >
            <FormattedMessage {...messages.recording} />
          </span>
          <span style={{ float: 'right', verticalAlign: 'top', height: 20, marginTop: 2 }}>
            <label htmlFor="toggleRecording" style={this.styles.toggleRecordingLabel}>
              {this.props.activeVoiceInteraction.recording
                ? <FormattedMessage {...messages.on} />
                : <FormattedMessage {...messages.off} />
              }
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
      recordingContainer = <div style={{ height: '6px', width: '100%' }}></div>;
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
      const warmTransfersMapped = this.props.activeVoiceInteraction.warmTransfers.map((warmTransfer) =>
        <TransferResource key={`${warmTransfer.id}-${warmTransfer.name}`} activeVoiceInteraction={this.props.activeVoiceInteraction} resource={warmTransfer} resumeAllAvailable={resourcesOnHold > 1} style={this.props.style} />
      );
      warmTransfers = (
        <div style={this.styles.warmTransfersContainer}>
          { warmTransfersMapped }
        </div>
      );
    }

    return (
      <div style={this.styles.base}>
        {recordingContainer}
        <div style={this.styles.bottonRowContainer}>
          <div style={this.styles.center}>
            <CircleIconButton id="endCallButton" name="endCall" onClick={this.endInteraction} style={this.styles.circleIconButtonRow} />
            {
              this.props.activeVoiceInteraction.meOnHold !== true
              ? <CircleIconButton id="muteButton" name="mute" active={this.props.activeVoiceInteraction.muted} onClick={this.setMute} style={this.styles.circleIconButtonRow} />
              : undefined
            }
            <CircleIconButton id="holdButton" name="hold" active={this.props.activeVoiceInteraction.onHold} onClick={this.setHold} style={this.styles.circleIconButtonRow} />
            {
              !connectingTransfers
              ? <CircleIconButton id="transferButton" name="transfer" active={this.state.showTransferMenu} onClick={() => this.setShowTransferMenu(!this.state.showTransferMenu)} style={this.styles.circleIconButtonRow} />
              : undefined
            }
            <CircleIconButton id="dialpadButton" name="dialpad" active={this.state.showActiveInteractionDialpad} onClick={() => this.setShowActiveInteractionDialpad(!this.state.showActiveInteractionDialpad)} style={this.styles.circleIconButtonRow} />
          </div>
        </div>
        {
          this.state.showTransferMenu && !connectingTransfers
          ? <div>
            <div style={[this.props.style.topTriangle, this.styles.transferTopTriangle]}></div>
            <div id="transfersContainer" style={[this.props.style.phoneControlsPopupMenu, this.styles.transferPhoneControlsPopupMenu]}>
              <TransferMenu interactionId={this.props.activeVoiceInteraction.interactionId} setShowTransferMenu={this.setShowTransferMenu} />
            </div>
          </div>
          : undefined
        }
        {
          this.state.showActiveInteractionDialpad
          ? <div>
            <div style={[this.props.style.topTriangle, this.styles.activeVoiceInteractionDialpadTopTriangle]}></div>
            <div style={[this.props.style.phoneControlsPopupMenu, this.styles.activeVoiceInteractionDialpadPhoneControlsPopupMenu]}>
              <Dialpad id="activeInteractionDialpad" interactionId={this.props.activeVoiceInteraction.interactionId} setDialpadText={this.setActiveInteractionDialpadText} dialpadText={this.state.activeInteractionDialpadText} inCall />
            </div>
          </div>
          : undefined
        }
        {
          this.props.activeVoiceInteraction.meOnHold === true
          ? <Button id="agentOnHoldButton" text={messages.onHold} mouseOverText={messages.resume} type="primaryRed" onClick={this.resumeMe} style={this.styles.meOnHold} />
          : undefined
        }
        { warmTransfers }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  agentId: selectAgentId(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

PhoneControlsActive.propTypes = {
  agentId: PropTypes.string.isRequired,
  activeVoiceInteraction: PropTypes.object,
  style: PropTypes.shape({
    topTriangle: PropTypes.object.isRequired,
    phoneControlsPopupMenu: PropTypes.object.isRequired,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(PhoneControlsActive));
