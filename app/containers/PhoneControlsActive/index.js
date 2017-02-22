/*
 *
 * PhoneControlsActive
 *
 */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

import Toggle from 'react-toggle';
import '../../assets/css/react-toggle-style.css';

import TransferMenu from 'containers/TransferMenu';

import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';
import Timer from 'components/Timer';

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

  cancelTransfer() {
    SDK.interactions.voice.cancelTransfer({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  setRecording() {
    if (this.props.activeVoiceInteraction.recording) {
      SDK.interactions.voice.endRecording({ interactionId: this.props.activeVoiceInteraction.interactionId });
    } else {
      SDK.interactions.voice.startRecording({ interactionId: this.props.activeVoiceInteraction.interactionId });
    }
  }

  endInteraction() {
    SDK.interactions.end({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  setMute() {
    if (this.props.activeVoiceInteraction.muted) {
      SDK.interactions.voice.unmute({ interactionId: this.props.activeVoiceInteraction.interactionId });
    } else {
      SDK.interactions.voice.mute({ interactionId: this.props.activeVoiceInteraction.interactionId });
    }
  }

  setHold() {
    if (this.props.activeVoiceInteraction.onHold) {
      SDK.interactions.voice.resume({ interactionId: this.props.activeVoiceInteraction.interactionId });
    } else {
      SDK.interactions.voice.hold({ interactionId: this.props.activeVoiceInteraction.interactionId });
    }
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
    warmTransfersContainer: {
      marginTop: '11px',
    },
    warmTransfer: {
      padding: '11px 23px',
      fontSize: '15px',
      fontWeight: 600,
    },
    transferInProgress: {
      color: '#979797',
    },
    transferConnectedStatus: {
      maxWidth: '160px',
    },
    cancelTransfer: {
      fontSize: '16px',
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
    transferOnHoldIcon: {
      border: '1px solid #23CEF5',
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
    transferTimer: {
      float: 'right',
      fontSize: '14px',
      fontWeight: 'normal',
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

    let warmTransfers;
    if (this.props.activeVoiceInteraction.warmTransfers.length > 0) {
      const warmTransfersMapped = this.props.activeVoiceInteraction.warmTransfers.map((warmTransfer) => {
        let status;
        let transferStyle;
        let transferStatusStyle;
        let icon;
        if (warmTransfer.status === 'transferring') {
          status = <FormattedMessage {...messages.connecting} />;
          transferStyle = this.styles.transferInProgress;
          icon = <span title="Cancel transfer" onClick={() => this.cancelTransfer()} style={this.styles.cancelTransfer}>&#10060;</span>;
        } else if (warmTransfer.status === 'connected') {
          icon = <div style={[this.styles.transferStatusIcon, this.styles.transferConnectedIcon]}></div>;
          transferStatusStyle = this.styles.transferConnectedStatus;
        } else {
          throw new Error(`transfer status not valid: ${warmTransfer.status}`);
        }
        return (
          <div id={`transfer-${warmTransfer.type}-${warmTransfer.id}`} key={`transfer-${warmTransfer.type}-${warmTransfer.id}`} style={[this.styles.warmTransfer, transferStyle]}>
            { icon }
            <span title={warmTransfer.name} style={[this.styles.transferName, transferStatusStyle]}>
              { warmTransfer.name }
            </span>
            {status
              ? <span style={this.styles.transferStatus}>({status})</span>
              : ''
            }
            <Timer format="mm:ss" style={this.styles.transferTimer} />
          </div>
        );
      });
      warmTransfers = (
        <div style={this.styles.warmTransfersContainer}>
          { warmTransfersMapped }
        </div>
      );
    }

    return (
      <div style={this.styles.base}>
        {recordingContainer}
        <div style={{ height: 40, width: 216, margin: '0 auto', display: 'block' }}>
          <CircleIconButton id="endCallButton" name="endCall" onClick={this.endInteraction} style={this.styles.circleIconButtonRow} />
          <CircleIconButton id="muteButton" name="mute" active={this.props.activeVoiceInteraction.muted} onClick={this.setMute} style={this.styles.circleIconButtonRow} />
          <CircleIconButton id="holdButton" name="hold" active={this.props.activeVoiceInteraction.onHold} onClick={this.setHold} style={this.styles.circleIconButtonRow} />
          <CircleIconButton id="transferButton" name="transfer" active={this.state.showTransferMenu} onClick={() => this.setShowTransferMenu(!this.state.showTransferMenu)} style={this.styles.circleIconButtonRow} />
          <CircleIconButton id="dialpadButton" name="dialpad" active={this.state.showActiveInteractionDialpad} onClick={() => this.setShowActiveInteractionDialpad(!this.state.showActiveInteractionDialpad)} style={this.styles.circleIconButtonRow} />
        </div>
        { this.state.showTransferMenu
          ? <div>
            <div style={[this.props.style.topTriangle, this.styles.transferTopTriangle]}></div>
            <div id="transfersContainer" style={[this.props.style.phoneControlsPopupMenu, this.styles.transferPhoneControlsPopupMenu]}>
              <TransferMenu interactionId={this.props.activeVoiceInteraction.interactionId} setShowTransferMenu={this.setShowTransferMenu} />
            </div>
          </div>
          : ''
        }
        { this.state.showActiveInteractionDialpad
          ? <div>
            <div style={[this.props.style.topTriangle, this.styles.activeVoiceInteractionDialpadTopTriangle]}></div>
            <div style={[this.props.style.phoneControlsPopupMenu, this.styles.activeVoiceInteractionDialpadPhoneControlsPopupMenu]}>
              <Dialpad id="activeInteractionDialpad" setDialpadText={this.setActiveInteractionDialpadText} dialpadText={this.state.activeInteractionDialpadText} />
            </div>
          </div>
          : ''
        }
        { warmTransfers }
      </div>
    );
  }
}

PhoneControlsActive.propTypes = {
  activeVoiceInteraction: PropTypes.object,
  style: PropTypes.shape({
    topTriangle: PropTypes.object.isRequired,
    phoneControlsPopupMenu: PropTypes.object.isRequired,
  }),
};

export default (Radium(PhoneControlsActive));
