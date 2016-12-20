/**
*
* Icon
*
*/

import React, { PropTypes } from 'react';
import config from 'assets/icons/config.png';
import message from 'assets/icons/message.png';
import messageNew from 'assets/icons/message_new.png';

import Radium from 'radium';

function Icon(props) {
  const getIcon = () => {
    switch (props.name) {
      case 'config':
        return config;
      case 'messaage':
        return message;
      case 'message_new':
        return messageNew;
      default:
        return null;
    }
  };

  return (
    <img src={getIcon()} style={props.style} alt={props.name} />
  );
}

Icon.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
};

export default Radium(Icon);
