/**
*
* Icon
*
*/

import React, { PropTypes } from 'react';
import config from 'assets/icons/config.png';
import search from 'assets/icons/search.png';
import close from 'assets/icons/close.png';
import message from 'assets/icons/message.png';
import messageNew from 'assets/icons/message_new.png';
import messageDark from 'assets/icons/message_dark.png';
import email from 'assets/icons/email.png';
import emailNew from 'assets/icons/email_new.png';
import emailDark from 'assets/icons/email_dark.png';
import voice from 'assets/icons/voice.png';
import voiceDark from 'assets/icons/voice_dark.png';
import connected from 'assets/icons/connected.png';
import notConnected from 'assets/icons/not_connected.png';
import endCallSprite from 'assets/icons/end_call_sprite.png';
import muteSprite from 'assets/icons/mute_sprite.png';
import holdSprite from 'assets/icons/hold_sprite.png';
import transferSprite from 'assets/icons/transfer_sprite.png';
import dialpadSprite from 'assets/icons/dialpad_sprite.png';

import Radium from 'radium';

function Icon(props) {
  let icon;
  let iconSprite;
  let backgroundPosition;
  let backgroundPositionHover;
  let display;
  let borderRadius;
  let height;
  let width;
  let className;
  switch (props.name) {
    case 'config':
      icon = config;
      break;
    case 'search':
      icon = search;
      height = '16px';
      width = '16px';
      break;
    case 'close':
      icon = close;
      break;
    case 'message':
      icon = message;
      width = '18px';
      height = '15px';
      break;
    case 'message_new':
      icon = messageNew;
      width = '18px';
      height = '15px';
      break;
    case 'message_dark':
      icon = messageDark;
      height = '20px';
      width = '20px';
      break;
    case 'email':
      icon = email;
      width = '18px';
      height = '15px';
      break;
    case 'email_new':
      icon = emailNew;
      width = '18px';
      height = '15px';
      break;
    case 'email_dark':
      icon = emailDark;
      height = '17px';
      width = '20px';
      break;
    case 'voice':
      icon = voice;
      height = '20px';
      width = '16px';
      break;
    case 'voice_dark':
      icon = voiceDark;
      height = '20px';
      width = '16px';
      break;
    case 'connected':
      icon = connected;
      break;
    case 'not_connected':
      icon = notConnected;
      break;
    case 'endCall':
      iconSprite = endCallSprite;
      height = '40px';
      width = '40px';
      display = 'block';
      borderRadius = '50%';
      backgroundPositionHover = '-80px 0';
      break;
    case 'mute':
      iconSprite = muteSprite;
      height = '40px';
      width = '40px';
      display = 'block';
      borderRadius = '50%';
      if (props.active) {
        backgroundPosition = '-80px 0';
        className = 'active';
      }
      backgroundPositionHover = '-40px 0';
      break;
    case 'hold':
      iconSprite = holdSprite;
      height = '40px';
      width = '40px';
      display = 'block';
      borderRadius = '50%';
      if (props.active) {
        backgroundPosition = '-80px 0';
        className = 'active';
      }
      backgroundPositionHover = '-40px 0';
      break;
    case 'transfer':
      iconSprite = transferSprite;
      height = '40px';
      width = '40px';
      display = 'block';
      borderRadius = '50%';
      if (props.active) {
        backgroundPosition = '-80px 0';
        className = 'active';
      }
      backgroundPositionHover = '-40px 0';
      break;
    case 'dialpad':
      iconSprite = dialpadSprite;
      height = '40px';
      width = '40px';
      display = 'block';
      borderRadius = '50%';
      if (props.active) {
        backgroundPosition = '-80px 0';
        className = 'active';
      }
      backgroundPositionHover = '-40px 0';
      break;
    default:
      console.error('Unhandled name:', props.name);
      break;
  }

  const styles = {
    base: {
      cursor: 'pointer',
      ':hover': {
        backgroundPosition: backgroundPositionHover,
      },
      backgroundImage: iconSprite ? `url(${iconSprite})` : '',
      backgroundPosition,
      borderRadius,
      display,
    },
  };

  if (width) {
    styles.base.width = width;
  }
  if (height) {
    styles.base.height = height;
  }

  let iconResult;
  if (icon) {
    iconResult = (
      <img
        id={props.id ? props.id : `${props.name}-icon`}
        className={className}
        onClick={props.onclick}
        src={icon}
        style={[styles.base, props.style]}
        alt={props.name}
      />
    );
  } else {
    iconResult = (
      <span
        id={props.id ? props.id : `${props.name}-icon`}
        className={className}
        onClick={props.onclick}
        style={[styles.base, props.style]}
      ></span>
    );
  }

  return iconResult;
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  style: PropTypes.object,
  id: PropTypes.string,
  onclick: PropTypes.func,
};

export default Radium(Icon);
