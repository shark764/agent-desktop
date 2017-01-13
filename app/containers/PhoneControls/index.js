/*
 *
 * PhoneControls
 *
 */

import React, { PropTypes } from 'react';
import Radium from 'radium';

import { PhoneNumberUtil } from 'google-libphonenumber';

import messages from './messages';

import Button from 'components/Button';
import ButtonDialpad from 'components/ButtonDialpad';
import CircleIconButton from 'components/CircleIconButton';
import TextInput from 'components/TextInput';


export class PhoneControls extends React.PureComponent {

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

  setDialpadText(dialpadText) {
    let formattedDialpadText = dialpadText.replace(/[^0-9+*#]/g, '');
    if (formattedDialpadText.indexOf('+') !== 0) {
      formattedDialpadText = `+${formattedDialpadText}`;
    }
    let isValid = false;
    try {
      isValid = this.phoneNumberUtil.isValidNumber(this.phoneNumberUtil.parse(formattedDialpadText, 'E164'));
    } catch (e) {
      // Do nothing
    }
    this.setState({ dialpadTextValid: isValid });
    this.setState({ dialpadText: formattedDialpadText });
  }

  phoneNumberUtil = PhoneNumberUtil.getInstance();

  styles = {
    base: {
      backgroundColor: '#031417',
    },
    topTriangle: {
      width: '0px',
      height: '0px',
      borderTop: 'none',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '10px solid white',
      margin: '5px 0 0 131px',
      position: 'absolute',
      zIndex: 3,
    },
    dialpad: {
      width: '282px',
      height: '394px',
      margin: '13px 0 0 14px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.23)',
      borderRadius: '3px',
      position: 'absolute',
      zIndex: 2,
      padding: '25px 20px 20px',
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
    return (
      <div style={[this.styles.base, this.props.style]}>
        <CircleIconButton name="dialpad" onClick={() => this.setShowDialpad(!this.state.showDialpad)} style={{ margin: '10px 0 0 calc(50% - 29px)' }} />
        { this.state.showDialpad
          ? <div>
            <div style={this.styles.topTriangle}></div>
            <div style={this.styles.dialpad}>
              <TextInput cb={this.setDialpadText} value={this.state.dialpadText} style={this.styles.dialpadText} />
              <div style={this.styles.dialpadButtonContainer}>
                <ButtonDialpad text="1" type="topLeft" onClick={() => this.setDialpadText(`${this.state.dialpadText}1`)} />
                <ButtonDialpad text="2" type="top" onClick={() => this.setDialpadText(`${this.state.dialpadText}2`)} />
                <ButtonDialpad text="3" type="topRight" onClick={() => this.setDialpadText(`${this.state.dialpadText}3`)} />
                <ButtonDialpad text="4" type="left" onClick={() => this.setDialpadText(`${this.state.dialpadText}4`)} />
                <ButtonDialpad text="5" type="middle" onClick={() => this.setDialpadText(`${this.state.dialpadText}5`)} />
                <ButtonDialpad text="6" type="right" onClick={() => this.setDialpadText(`${this.state.dialpadText}6`)} />
                <ButtonDialpad text="7" type="left" onClick={() => this.setDialpadText(`${this.state.dialpadText}7`)} />
                <ButtonDialpad text="8" type="middle" onClick={() => this.setDialpadText(`${this.state.dialpadText}8`)} />
                <ButtonDialpad text="9" type="right" onClick={() => this.setDialpadText(`${this.state.dialpadText}9`)} />
                <ButtonDialpad text="*" type="bottomLeft" onClick={() => this.setDialpadText(`${this.state.dialpadText}*`)} />
                <ButtonDialpad text="0" type="bottom" onClick={() => this.setDialpadText(`${this.state.dialpadText}0`)} />
                <ButtonDialpad text="#" type="bottomRight" onClick={() => this.setDialpadText(`${this.state.dialpadText}#`)} />
              </div>
              <Button text={messages.call} disabled={!this.state.dialpadTextValid} onClick={() => alert(`here's my number: ${this.state.dialpadText}, call me maybe`)} type="primaryBlue" style={this.styles.callButton} />
            </div>
          </div>
          : ''
        }
      </div>
    );
  }
}

PhoneControls.propTypes = {
  style: PropTypes.array,
};

export default Radium(PhoneControls);
