/*
 *
 * PhoneControlsInactive
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import messages from './messages';
import Radium from 'radium';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { selectIsAgentReady, selectHasConnectingOutboundVoiceInteraction } from './selectors';

import { startOutboundInteraction } from 'containers/AgentDesktop/actions';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';
import IconSVG from 'components/IconSVG';

export class PhoneControlsInactive extends React.Component {
  constructor(props) {
    super(props);

    this.setShowDialpad = this.setShowDialpad.bind(this);
    this.setDialpadText = this.setDialpadText.bind(this);
    this.call = this.call.bind(this);

    this.state = {
      showDialpad: false,
      dialpadText: '',
      dialpadTextValid: false,
    };
  }

  setShowDialpad(showDialpad) {
    this.setState({ showDialpad });
  }

  phoneNumberUtil = PhoneNumberUtil.getInstance();

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

  call() {
    this.props.startOutboundInteraction('voice');
    SDK.interactions.voice.dial({ phoneNumber: this.state.dialpadText });
    this.setState({ showDialpad: false });
  }

  styles = {
    base: {
      padding: '12px 0',
    },
    phoneControlsContainer: {
      height: 40,
      width: 40,
      margin: '0 auto',
      display: 'block',
    },
    dialpadTopTriangle: {
      marginLeft: '134px',
    },
    dialpadPhoneControlsPopupMenu: {
      height: '394px',
    },
    callButton: {
      display: 'block',
      margin: '24px auto 0',
      width: '102px',
    },
  }

  render() {
    let phoneControlsInactive;
    if (this.props.isAgentReady) {
      if (!this.props.hasConnectingOutboundVoiceInteraction) {
        phoneControlsInactive = (
          <div>
            <div style={this.styles.phoneControlsContainer}>
              <CircleIconButton id="dialpadButton" name="dialpad" onClick={() => this.setShowDialpad(!this.state.showDialpad)} />
            </div>
            { this.state.showDialpad
              ? <div>
                <div style={[this.props.style.topTriangle, this.styles.dialpadTopTriangle]}></div>
                <div style={[this.props.style.phoneControlsPopupMenu, this.styles.dialpadPhoneControlsPopupMenu]}>
                  <Dialpad id="dialpad" setDialpadText={this.setDialpadText} dialpadText={this.state.dialpadText} />
                  <Button id="callButton" text={messages.call} disabled={!this.state.dialpadTextValid} onClick={this.call} type="primaryBlue" style={this.styles.callButton} />
                </div>
              </div>
              : ''
            }
          </div>
        );
      } else {
        phoneControlsInactive = (
          <div style={this.styles.phoneControlsContainer}>
            <IconSVG style={this.styles.phoneControlsContainer} id="connectingToOutboundCallIcon" name="loading" />
          </div>
        );
      }
    } else {
      phoneControlsInactive = <div style={this.styles.phoneControlsContainer}></div>;
    }

    return (
      <div style={this.styles.base}>
        { phoneControlsInactive }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isAgentReady: selectIsAgentReady(state, props),
  hasConnectingOutboundVoiceInteraction: selectHasConnectingOutboundVoiceInteraction(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    startOutboundInteraction: (channelType) => dispatch(startOutboundInteraction(channelType)),
    dispatch,
  };
}

PhoneControlsInactive.propTypes = {
  isAgentReady: PropTypes.bool.isRequired,
  hasConnectingOutboundVoiceInteraction: PropTypes.bool.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
  style: PropTypes.shape({
    topTriangle: PropTypes.object.isRequired,
    phoneControlsPopupMenu: PropTypes.object.isRequired,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(PhoneControlsInactive));
