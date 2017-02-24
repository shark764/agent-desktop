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

import { selectIsAgentReady } from './selectors';

import Button from 'components/Button';
import CircleIconButton from 'components/CircleIconButton';
import Dialpad from 'components/Dialpad';

export class PhoneControlsInactive extends React.Component {
  constructor(props) {
    super(props);

    this.setShowDialpad = this.setShowDialpad.bind(this);
    this.setDialpadText = this.setDialpadText.bind(this);

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

  styles = {
    base: {
      padding: '12px 0',
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
    return (
      <div style={this.styles.base}>
        { this.props.isAgentReady
          ? <div>
            <div style={{ height: 40, width: 40, margin: '0 auto', display: 'block' }}>
              <CircleIconButton id="dialpadButton" name="dialpad" onClick={() => this.setShowDialpad(!this.state.showDialpad)} />
            </div>
            { this.state.showDialpad
              ? <div>
                <div style={[this.props.style.topTriangle, this.styles.dialpadTopTriangle]}></div>
                <div style={[this.props.style.phoneControlsPopupMenu, this.styles.dialpadPhoneControlsPopupMenu]}>
                  <Dialpad id="dialpad" setDialpadText={this.setDialpadText} dialpadText={this.state.dialpadText} />
                  <Button id="callButton" text={messages.call} disabled={!this.state.dialpadTextValid} onClick={() => alert(this.state.dialpadText)} type="primaryBlue" style={this.styles.callButton} />
                </div>
              </div>
              : ''
            }
          </div>
          : <div style={{ height: 40, width: 40, margin: '0 auto', display: 'block' }}></div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isAgentReady: selectIsAgentReady(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

PhoneControlsInactive.propTypes = {
  isAgentReady: PropTypes.bool.isRequired,
  style: PropTypes.shape({
    topTriangle: PropTypes.object.isRequired,
    phoneControlsPopupMenu: PropTypes.object.isRequired,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(PhoneControlsInactive));
