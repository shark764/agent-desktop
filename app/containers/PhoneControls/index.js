/*
 *
 * PhoneControls
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import { PhoneNumberUtil } from 'google-libphonenumber';
import Toggle from 'react-toggle';
import '../../assets/css/react-toggle-style.css';

import { selectActiveVoiceInteraction } from './selectors';
import messages from './messages';
import TransferMenu from 'containers/TransferMenu';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';

export class PhoneControls extends React.Component {

  constructor(props) {
    super(props);

    this.setRecording = this.setRecording.bind(this);
    this.setShowDialpad = this.setShowDialpad.bind(this);
    this.setDialpadText = this.setDialpadText.bind(this);
    this.setShowActiveInteractionDialpad = this.setShowActiveInteractionDialpad.bind(this);
    this.setActiveInteractionDialpadText = this.setActiveInteractionDialpadText.bind(this);

    this.endInteraction = this.endInteraction.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    this.hold = this.hold.bind(this);
    this.resume = this.resume.bind(this);

    this.state = {
      showTransferMenu: false,
      showDialpad: false,
      dialpadText: '',
      dialpadTextValid: false,
      showActiveInteractionDialpad: false,
      activeInteractionDialpadText: '',
    };
  }

  setRecording() {
    if (this.props.activeVoiceInteraction.recording) {
      SDK.interactions.voice.endRecording({ interactionId: this.props.activeVoiceInteraction.interactionId });
    } else {
      SDK.interactions.voice.startRecording({ interactionId: this.props.activeVoiceInteraction.interactionId });
    }
  }

  setShowTransferMenu(showTransferMenu) {
    this.setState({
      showTransferMenu,
      showActiveInteractionDialpad: false,
    });
  }

  setShowDialpad(showDialpad) {
    this.setState({ showDialpad });
  }

  setDialpadText(dialpadText) {
    let formattedDialpadText = dialpadText.replace(/[^0-9+*#]/g, '');
    if (formattedDialpadText.indexOf('+') !== 0) {
      formattedDialpadText = `+${formattedDialpadText}`;
    }
    let isValid = false;
    try {
      isValid = this.phoneNumberUtil.isValidNumber(this.phoneNumberUtil.parse(formattedDialpadText, 'E164'));
    } catch (e) {
      // Do nothing, this just means it is invalid
    }
    this.setState({ dialpadTextValid: isValid });
    this.setState({ dialpadText: formattedDialpadText });
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

  phoneNumberUtil = PhoneNumberUtil.getInstance();

  endInteraction() {
    SDK.interactions.end({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  mute() {
    SDK.interactions.voice.mute({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  unmute() {
    SDK.interactions.voice.unmute({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  hold() {
    SDK.interactions.voice.hold({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  resume() {
    SDK.interactions.voice.resume({ interactionId: this.props.activeVoiceInteraction.interactionId });
  }

  styles = {
    base: {
      backgroundColor: '#031417',
      color: '#FFFFFF',
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
    topTriangle: {
      width: '0px',
      height: '0px',
      borderTop: 'none',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '10px solid white',
      position: 'absolute',
      marginTop: '4px',
      zIndex: 3,
    },
    dialpadTopTriangle: {
      marginLeft: '134px',
    },
    activeVoiceInteractionDialpadTopTriangle: {
      marginLeft: '219px',
    },
    transferTopTriangle: {
      marginLeft: '177px',
      borderBottom: '10px solid #F3F3F3',
    },
    phoneControlsPopupMenu: {
      width: '282px',
      margin: '10px 0 0 14px',
      backgroundColor: '#FFFFFF',
      color: '#4B4B4B',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.23)',
      borderRadius: '3px',
      overflow: 'hidden',
      position: 'absolute',
      zIndex: 2,
      padding: '25px 20px 20px',
    },
    dialpadPhoneControlsPopupMenu: {
      height: '394px',
    },
    activeVoiceInteractionDialpadPhoneControlsPopupMenu: {
      height: '339px',
    },
    transferPhoneControlsPopupMenu: {
      padding: 0,
      fontSize: '14px',
    },
    dialpadText: {
      height: '32px',
      width: '100%',
    },
    dialpadButtonContainer: {
      marginTop: '13px',
    },
    callButton: {
      display: 'block',
      margin: '24px auto 0',
      width: '102px',
    },
  }

  render() {
    let controls;
    if (this.props.activeVoiceInteraction) {
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

      controls = (
        <div style={{ padding: '6px 0 12px' }}>
          {recordingContainer}
          <div style={{ height: 40, width: 216, margin: '0 auto', display: 'block' }}>
            <CircleIconButton id="endCallButton" name="endCall" onClick={this.endInteraction} style={this.styles.circleIconButtonRow} />
            <CircleIconButton id="muteButton" name="mute" inactiveOnClick={this.mute} activeOnClick={this.unmute} style={this.styles.circleIconButtonRow} />
            <CircleIconButton id="holdButton" name="hold" inactiveOnClick={this.hold} activeOnClick={this.resume} style={this.styles.circleIconButtonRow} />
            <CircleIconButton id="transferButton" name="transfer" active={this.state.showTransferMenu} onClick={() => this.setShowTransferMenu(!this.state.showTransferMenu)} style={this.styles.circleIconButtonRow} />
            <CircleIconButton id="dialpadButton" name="dialpad" active={this.state.showActiveInteractionDialpad} onClick={() => this.setShowActiveInteractionDialpad(!this.state.showActiveInteractionDialpad)} style={this.styles.circleIconButtonRow} />
          </div>
          { this.state.showTransferMenu
            ? <div>
              <div style={[this.styles.topTriangle, this.styles.transferTopTriangle]}></div>
              <div id="transfersContainer" style={[this.styles.phoneControlsPopupMenu, this.styles.transferPhoneControlsPopupMenu]}>
                <TransferMenu interactionId={this.props.activeVoiceInteraction.interactionId} />
              </div>
            </div>
            : ''
          }
          { this.state.showActiveInteractionDialpad
            ? <div>
              <div style={[this.styles.topTriangle, this.styles.activeVoiceInteractionDialpadTopTriangle]}></div>
              <div style={[this.styles.phoneControlsPopupMenu, this.styles.activeVoiceInteractionDialpadPhoneControlsPopupMenu]}>
                <Dialpad id="activeInteractionDialpad" setDialpadText={this.setActiveInteractionDialpadText} dialpadText={this.state.activeInteractionDialpadText} />
              </div>
            </div>
            : ''
          }
        </div>
      );
    } else {
      controls = (
        <div style={{ padding: '12px 0' }}>
          <div style={{ height: 40, width: 40, margin: '0 auto', display: 'block' }}>
            <CircleIconButton id="dialpadButton" name="dialpad" onClick={() => this.setShowDialpad(!this.state.showDialpad)} />
          </div>
          { this.state.showDialpad
            ? <div>
              <div style={[this.styles.topTriangle, this.styles.dialpadTopTriangle]}></div>
              <div style={[this.styles.phoneControlsPopupMenu, this.styles.dialpadPhoneControlsPopupMenu]}>
                <Dialpad id="dialpad" setDialpadText={this.setDialpadText} dialpadText={this.state.dialpadText} />
                <Button id="callButton" text={messages.call} disabled={!this.state.dialpadTextValid} onClick={() => alert(`here's my number: ${this.state.dialpadText}, call me maybe`)} type="primaryBlue" style={this.styles.callButton} />
              </div>
            </div>
            : ''
          }
        </div>
      );
    }

    return (
      <div style={[this.styles.base, this.props.style]}>
        {controls}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  activeVoiceInteraction: selectActiveVoiceInteraction(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

PhoneControls.propTypes = {
  activeVoiceInteraction: PropTypes.object,
  style: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(PhoneControls));
