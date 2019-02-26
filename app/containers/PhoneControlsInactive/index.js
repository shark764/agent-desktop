/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * PhoneControlsInactive
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { PhoneNumberUtil } from 'google-libphonenumber';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';
import IconSVG from 'components/IconSVG';

import { selectIsAgentReady } from 'containers/AgentDesktop/selectors';
import { startOutboundInteraction } from 'containers/AgentDesktop/actions';

import { getSelectedOutboundPhoneIdentifier } from 'containers/OutboundAniSelect/selectors';

import messages from './messages';
import { selectHasConnectingOutboundVoiceInteraction } from './selectors';

export class PhoneControlsInactive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDialpad: false,
      dialpadText: '',
      dialpadTextValid: false,
    };
  }

  setShowDialpad = (showDialpad) => {
    this.setState({ showDialpad });
  };

  toggleDialpad = () => {
    this.setShowDialpad(!this.state.showDialpad);
  };

  phoneNumberUtil = PhoneNumberUtil.getInstance();

  setDialpadText = (dialpadText) => {
    let formattedDialpadText = dialpadText.replace(/[^0-9+*#]/g, '');
    if (formattedDialpadText.indexOf('+') !== 0) {
      formattedDialpadText = `+${formattedDialpadText}`;
    }

    let isValid = false;
    try {
      isValid = this.phoneNumberUtil.isPossibleNumber(
        this.phoneNumberUtil.parse(formattedDialpadText, 'E164')
      );
    } catch (e) {
      // Do nothing, this just means it is invalid
    }
    this.setState({ dialpadTextValid: isValid });
    this.setState({ dialpadText: formattedDialpadText });
  };

  call = () => {
    if (this.state.dialpadTextValid) {
      this.props.startOutboundInteraction({
        channelType: 'voice',
        selectedOutboundAni: this.props.getSelectedOutboundPhoneIdentifier,
      });
      let outboundVoiceObject = { phoneNumber: this.state.dialpadText };
      if (this.props.getSelectedOutboundPhoneIdentifier) {
        const {
          outboundIdentifier,
          flowId,
        } = this.props.getSelectedOutboundPhoneIdentifier;
        outboundVoiceObject = {
          phoneNumber: this.state.dialpadText,
          outboundAni: outboundIdentifier,
          flowId,
        };
      }
      CxEngage.interactions.voice.dial(outboundVoiceObject);
      this.setState({ showDialpad: false });
    }
  };

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
    callButton: {
      display: 'block',
      margin: '24px auto 0',
      width: '102px',
    },
  };

  renderDialpad = () => {
    if (this.state.showDialpad) {
      return (
        <Dialpad
          id="dialpad"
          setDialpadText={this.setDialpadText}
          dialpadText={this.state.dialpadText}
          onEnter={this.call}
          inCall={false}
          toggle={this.toggleDialpad}
          transfer={false}
        >
          <Button
            id="callButton"
            text={messages.call}
            disabled={!this.state.dialpadTextValid}
            onClick={this.call}
            type="primaryBlue"
            style={this.styles.callButton}
          />
        </Dialpad>
      );
    } else {
      return null;
    }
  };

  render() {
    if (this.state.dialpadText === '+15068675309') {
      throw new Error('component error');
    }
    let phoneControlsInactive;
    if (this.props.isAgentReady) {
      if (!this.props.hasConnectingOutboundVoiceInteraction) {
        phoneControlsInactive = (
          <div>
            <div style={this.styles.phoneControlsContainer}>
              <CircleIconButton
                id="dialpadButton"
                name="dialpad"
                title={messages.dialpad}
                onClick={this.toggleDialpad}
                innerElement={this.renderDialpad()}
              />
            </div>
          </div>
        );
      } else {
        phoneControlsInactive = (
          <div style={this.styles.phoneControlsContainer}>
            <IconSVG
              id="connectingToOutboundCallIcon"
              name="loadingWhite"
              width="40px"
            />
          </div>
        );
      }
    } else {
      phoneControlsInactive = (
        <div style={this.styles.phoneControlsContainer} />
      );
    }

    return (
      <div style={this.styles.base}>
        {phoneControlsInactive}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isAgentReady: selectIsAgentReady(state, props),
  hasConnectingOutboundVoiceInteraction: selectHasConnectingOutboundVoiceInteraction(
    state,
    props
  ),
  getSelectedOutboundPhoneIdentifier: getSelectedOutboundPhoneIdentifier(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    startOutboundInteraction: (outboundInteractionData) =>
      dispatch(startOutboundInteraction(outboundInteractionData)),
    dispatch,
  };
}

PhoneControlsInactive.propTypes = {
  isAgentReady: PropTypes.bool.isRequired,
  hasConnectingOutboundVoiceInteraction: PropTypes.bool.isRequired,
  startOutboundInteraction: PropTypes.func.isRequired,
  getSelectedOutboundPhoneIdentifier: PropTypes.object,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(PhoneControlsInactive))
);
