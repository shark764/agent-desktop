/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Dialpad
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import OutboundAniSelect from 'containers/OutboundAniSelect';
import { getSelectedOutboundPhoneIdentifier } from 'containers/OutboundAniSelect/selectors';
import { selectOutboundPhoneIdentification } from 'containers/OutboundAniSelect/actions';

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
  mask: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    height: '100vh',
    width: '100vw',
    zIndex: 2,
  },
  topTriangle: {
    width: '0px',
    height: '0px',
    borderTop: 'none',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '10px solid white',
    position: 'absolute',
    left: '12px',
    zIndex: 4,
  },
  phoneControlsPopupMenu: {
    width: '282px',
    backgroundColor: '#FFFFFF',
    color: '#4B4B4B',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.23)',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'absolute',
    top: '52px',
    left: '-110px',
    zIndex: 11,
    padding: '25px 20px 20px',
  },
  outboundAniDiv: {
    margin: '0px auto 10px',
    width: '100%',
  },
};

export function Dialpad(props, context) {
  function buttonPress(num, fromKeyboard) {
    if (!fromKeyboard) props.setDialpadText(`${props.dialpadText}${num}`);
    if (props.interactionId !== undefined) {
      CxEngage.interactions.voice.sendDigits(
        { interactionId: props.interactionId, digit: num },
        (e, t, r) => {
          if (!e) {
            console.log('[Dialpad] CxEngage.subscribe()', t, r);
          }
        }
      );
    }
  }
  function inputKeyDown(event) {
    if (props.inCall) {
      const keyboardNumbers = new Map([
        ['48', '0'],
        ['49', '1'],
        ['50', '2'],
        ['51', '3'],
        ['52', '4'],
        ['53', '5'],
        ['54', '6'],
        ['55', '7'],
        ['56', '8'],
        ['57', '9'],
        ['96', '0'],
        ['97', '1'],
        ['98', '2'],
        ['99', '3'],
        ['100', '4'],
        ['101', '5'],
        ['102', '6'],
        ['103', '7'],
        ['104', '8'],
        ['105', '9'],
      ]);
      const allowedbuttons = new Map([
        ['46', 'delete'],
        ['8', 'backspace'],
        ['36', 'left'],
        ['37', 'up'],
        ['38', 'right'],
        ['39', 'down'],
      ]);
      if (event.keyCode === 51 && event.shiftKey) {
        buttonPress('#', true);
      } else if (event.keyCode === 56 && event.shiftKey) {
        buttonPress('*', true);
      } else if (event.keyCode === 106) {
        buttonPress('*', true);
      } else if (event.keyCode >= 48 && event.keyCode <= 57 && event.shiftKey) {
        event.preventDefault();
      } else if (
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105)
      ) {
        buttonPress(keyboardNumbers.get(event.keyCode.toString()), true);
      } else if (allowedbuttons.get(event.keyCode.toString()) !== undefined) {
        // Normal keyboard input operation , let the user move and delete chars
      } else {
        event.preventDefault();
      }
    }
  }

  let updatedDialerPosition;
  if (context.toolbarMode) {
    // use a custom position for the dialer if we're specifying one
    // (toolbar during a call being an example)
    if (props.dialpadPosition !== undefined) {
      updatedDialerPosition = props.dialpadPosition;
    } else {
      // otherwise, this is the default position for the
      // dialer in toolbar
      updatedDialerPosition = '-130px';
    }
  } else {
    // and here is the position for the dialer in AD
    updatedDialerPosition = styles.phoneControlsPopupMenu.left;
  }

  return (
    <div>
      {!props.transfer ? (
        <div id="dialpadMask" style={styles.mask} onClick={props.toggle} />
      ) : (
        undefined
      )}
      {!props.transfer && (
        <div id="dialpadtriangle" style={styles.topTriangle} />
      )}
      <div
        style={[
          !props.transfer && styles.phoneControlsPopupMenu,
          {
            left: updatedDialerPosition,
          },
        ]}
      >
        <div id={props.id} style={{ zIndex: '4' }}>
          {!props.interactionId && !props.transfer && (
            <div style={styles.outboundAniDiv}>
              <OutboundAniSelect
                channelTypes={['voice']}
                changeSelected={props.selectOutboundPhoneIdentification}
                valueSelected={props.outboundPhoneIdentifier}
                styles={{
                  height: '32px',
                }}
              />
            </div>
          )}
          <TextInput
            id={`${props.id}TextInput`}
            cb={props.setDialpadText}
            onKeyDown={event => inputKeyDown(event)}
            onEnter={props.onEnter}
            value={props.dialpadText}
            style={styles.dialpadText}
            autoFocus
          />
          <div style={styles.dialpadButtonContainer}>
            <ButtonDialpad
              id={`${props.id}1Button`}
              text="1"
              type="topLeft"
              onClick={() => buttonPress('1')}
            />
            <ButtonDialpad
              id={`${props.id}2Button`}
              text="2"
              type="top"
              onClick={() => buttonPress('2')}
              subText="ABC"
            />
            <ButtonDialpad
              id={`${props.id}3Button`}
              text="3"
              type="topRight"
              onClick={() => buttonPress('3')}
              subText="DEF"
            />
            <ButtonDialpad
              id={`${props.id}4Button`}
              text="4"
              type="left"
              onClick={() => buttonPress('4')}
              subText="GHI"
            />
            <ButtonDialpad
              id={`${props.id}5Button`}
              text="5"
              type="middle"
              onClick={() => buttonPress('5')}
              subText="JKL"
            />
            <ButtonDialpad
              id={`${props.id}6Button`}
              text="6"
              type="right"
              onClick={() => buttonPress('6')}
              subText="MNO"
            />
            <ButtonDialpad
              id={`${props.id}7Button`}
              text="7"
              type="left"
              onClick={() => buttonPress('7')}
              subText="PQRS"
            />
            <ButtonDialpad
              id={`${props.id}8Button`}
              text="8"
              type="middle"
              onClick={() => buttonPress('8')}
              subText="TUV"
            />
            <ButtonDialpad
              id={`${props.id}9Button`}
              text="9"
              type="right"
              onClick={() => buttonPress('9')}
              subText="WXYZ"
            />
            <ButtonDialpad
              id={`${props.id}StarButton`}
              text="*"
              type="bottomLeft"
              onClick={() => buttonPress('*')}
            />
            <ButtonDialpad
              id={`${props.id}0Button`}
              text="0"
              type="bottom"
              onClick={() => buttonPress('0')}
            />
            <ButtonDialpad
              id={`${props.id}NumberButton`}
              text="#"
              type="bottomRight"
              onClick={() => buttonPress('#')}
            />
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
}

Dialpad.propTypes = {
  id: PropTypes.string.isRequired,
  onEnter: PropTypes.func,
  dialpadText: PropTypes.string.isRequired,
  setDialpadText: PropTypes.func.isRequired,
  interactionId: PropTypes.string, // eslint-disable-line
  inCall: PropTypes.bool,
  children: PropTypes.element,
  toggle: PropTypes.func,
  transfer: PropTypes.bool.isRequired,
  dialpadPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  outboundPhoneIdentifier: PropTypes.object,
  selectOutboundPhoneIdentification: PropTypes.func.isRequired,
};

Dialpad.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export const actions = {
  selectOutboundPhoneIdentification,
};

const mapStateToProps = (state, props) => ({
  outboundPhoneIdentifier: getSelectedOutboundPhoneIdentifier(state, props),
});

export default ErrorBoundary(
  connect(mapStateToProps, actions)(Radium(Dialpad))
);
