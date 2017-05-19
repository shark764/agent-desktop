/**
*
* Dialpad
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ButtonDialpad from 'components/ButtonDialpad';
import TextInput from 'components/TextInput';

const styles = {
  dialpadText: {
    height: '32px',
    width: '100%',
  },
  dialpadButtonContainer: {
    marginTop: '13px',
  },
};

function Dialpad(props) {
  function buttonPress(num) {
    props.setDialpadText(`${props.dialpadText}${num}`);
    if (props.interactionId !== undefined) {
      CxEngage.interactions.voice.sendDigits({ interactionId: props.interactionId, digit: num },
        (e, t, r) => {
          if (e) {
            console.error('DTMF Error:', e);
          } else {
            console.log('[Dialpad] CxEngage.subscribe()', t, r);
          }
        });
    }
  }

  return (
    <div id={props.id} >
      <TextInput
        id={`${props.id}TextInput`}
        cb={props.setDialpadText}
        disabled={props.inCall || false}
        onEnter={props.onEnter}
        value={props.dialpadText}
        style={styles.dialpadText}
        autoFocus
      />
      <div style={styles.dialpadButtonContainer}>
        <ButtonDialpad id={`${props.id}1Button`} text="1" type="topLeft" onClick={() => buttonPress('1')} />
        <ButtonDialpad id={`${props.id}2Button`} text="2" type="top" onClick={() => buttonPress('2')} />
        <ButtonDialpad id={`${props.id}3Button`} text="3" type="topRight" onClick={() => buttonPress('3')} />
        <ButtonDialpad id={`${props.id}4Button`} text="4" type="left" onClick={() => buttonPress('4')} />
        <ButtonDialpad id={`${props.id}5Button`} text="5" type="middle" onClick={() => buttonPress('5')} />
        <ButtonDialpad id={`${props.id}6Button`} text="6" type="right" onClick={() => buttonPress('6')} />
        <ButtonDialpad id={`${props.id}7Button`} text="7" type="left" onClick={() => buttonPress('7')} />
        <ButtonDialpad id={`${props.id}8Button`} text="8" type="middle" onClick={() => buttonPress('8')} />
        <ButtonDialpad id={`${props.id}9Button`} text="9" type="right" onClick={() => buttonPress('9')} />
        <ButtonDialpad id={`${props.id}StarButton`} text="*" type="bottomLeft" onClick={() => buttonPress('*')} />
        <ButtonDialpad id={`${props.id}0Button`} text="0" type="bottom" onClick={() => buttonPress('0')} />
        <ButtonDialpad id={`${props.id}NumberButton`} text="#" type="bottomRight" onClick={() => buttonPress('#')} />
      </div>
    </div>
  );
}

Dialpad.propTypes = {
  id: PropTypes.string.isRequired,
  onEnter: PropTypes.func,
  dialpadText: PropTypes.string.isRequired,
  setDialpadText: PropTypes.func.isRequired,
  interactionId: PropTypes.string,
  inCall: PropTypes.bool,
};

export default Radium(Dialpad);
