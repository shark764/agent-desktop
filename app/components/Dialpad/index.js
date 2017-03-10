/**
*
* Dialpad
*
*/

import React, { PropTypes } from 'react';
import Radium from 'radium';

import ButtonDialpad from 'components/ButtonDialpad';
import TextInput from 'components/TextInput';

function Dialpad(props) {
  const styles = {
    dialpadText: {
      height: '32px',
      width: '100%',
    },
    dialpadButtonContainer: {
      marginTop: '13px',
    },
  };

  return (
    <div id={props.id} >
      <TextInput id={`${props.id}TextInput`} cb={props.setDialpadText} onEnter={props.onEnter} value={props.dialpadText} autoFocus style={styles.dialpadText} />
      <div style={styles.dialpadButtonContainer}>
        <ButtonDialpad id={`${props.id}1Button`} text="1" type="topLeft" onClick={() => props.setDialpadText(`${props.dialpadText}1`)} />
        <ButtonDialpad id={`${props.id}2Button`} text="2" type="top" onClick={() => props.setDialpadText(`${props.dialpadText}2`)} />
        <ButtonDialpad id={`${props.id}3Button`} text="3" type="topRight" onClick={() => props.setDialpadText(`${props.dialpadText}3`)} />
        <ButtonDialpad id={`${props.id}4Button`} text="4" type="left" onClick={() => props.setDialpadText(`${props.dialpadText}4`)} />
        <ButtonDialpad id={`${props.id}5Button`} text="5" type="middle" onClick={() => props.setDialpadText(`${props.dialpadText}5`)} />
        <ButtonDialpad id={`${props.id}6Button`} text="6" type="right" onClick={() => props.setDialpadText(`${props.dialpadText}6`)} />
        <ButtonDialpad id={`${props.id}7Button`} text="7" type="left" onClick={() => props.setDialpadText(`${props.dialpadText}7`)} />
        <ButtonDialpad id={`${props.id}8Button`} text="8" type="middle" onClick={() => props.setDialpadText(`${props.dialpadText}8`)} />
        <ButtonDialpad id={`${props.id}9Button`} text="9" type="right" onClick={() => props.setDialpadText(`${props.dialpadText}9`)} />
        <ButtonDialpad id={`${props.id}StarButton`} text="*" type="bottomLeft" onClick={() => props.setDialpadText(`${props.dialpadText}*`)} />
        <ButtonDialpad id={`${props.id}0Button`} text="0" type="bottom" onClick={() => props.setDialpadText(`${props.dialpadText}0`)} />
        <ButtonDialpad id={`${props.id}NumberButton`} text="#" type="bottomRight" onClick={() => props.setDialpadText(`${props.dialpadText}#`)} />
      </div>
    </div>
  );
}

Dialpad.propTypes = {
  id: PropTypes.string.isRequired,
  onEnter: PropTypes.func,
  dialpadText: PropTypes.string.isRequired,
  setDialpadText: PropTypes.func.isRequired,
};

export default Radium(Dialpad);
