/**
*
* Icon
*
*/

import React, { PropTypes } from 'react';
import config from 'assets/icons/config.png';
import message from 'assets/icons/message.png';
import messageNew from 'assets/icons/message_new.png';
import email from 'assets/icons/email.png';
import emailNew from 'assets/icons/email_new.png';
import connected from 'assets/icons/connected.png';
import notConnected from 'assets/icons/not_connected.png';
import dialpad from 'assets/icons/dialpad.png';
import dialpadHover from 'assets/icons/dialpad_hover.png';

import Radium from 'radium';

function Icon(props) {
  let icon;
  let iconHover;
  let borderRadius;
  switch (props.name) {
    case 'config':
      icon = config;
      break;
    case 'message':
      icon = message;
      break;
    case 'message_new':
      icon = messageNew;
      break;
    case 'email':
      icon = email;
      break;
    case 'email_new':
      icon = emailNew;
      break;
    case 'connected':
      icon = connected;
      break;
    case 'not_connected':
      icon = notConnected;
      break;
    case 'dialpad':
      icon = dialpad;
      iconHover = dialpadHover;
      borderRadius = '50%';
      break;
    default:
      break;
  }

  const styles = {
    base: {
      ':hover': {
        content: iconHover ? `url(${iconHover})` : '',
      },
      borderRadius,
    },
  };

  return (
    <img id={props.id} src={icon} style={[props.style, styles.base]} alt={props.name} />
  );
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default Radium(Icon);
