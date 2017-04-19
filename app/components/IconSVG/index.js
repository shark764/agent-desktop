/**
*
* Icon
*
*/

import React, { PropTypes } from 'react';
import ReactSVG from 'react-svg';

import dialpad from 'assets/icons/dialpad.svg';
import loading from 'assets/icons/loading.svg';
import loadingWhite from 'assets/icons/loading_white.svg';
import add from 'assets/icons/add.svg';
import close from 'assets/icons/close.svg';

import Radium from 'radium';

const availableIcons = [
  'dialpad',
  'loading',
  'loadingWhite',
  'add',
  'close',
];

function IconSVG(props) {
  let icon;
  let iconHover;
  switch (props.name) {
    case 'dialpad':
      icon = dialpad;
      break;
    case 'loading':
      icon = loading;
      break;
    case 'loadingWhite':
      icon = loadingWhite;
      break;
    case 'add':
      icon = add;
      break;
    case 'close':
      icon = close;
      break;
    default:
      break;
  }

  const styles = {
    base: {
      ':hover': {
        content: iconHover ? `url(${iconHover})` : '',
      },
      borderRadius: '50%',
    },
  };

  return (
    <ReactSVG
      id={props.id}
      path={icon}
      evalScript="always"
      style={Object.assign(styles.base, props.style ? props.style : {})}
    />
  );
}

IconSVG.propTypes = {
  name: PropTypes.oneOf(availableIcons).isRequired,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default Radium(IconSVG);
