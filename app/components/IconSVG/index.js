/**
*
* Icon
*
*/

import React, { PropTypes } from 'react';
import ReactSVG from 'react-svg';

import dialpad from 'assets/icons/dialpad.svg';
import loading from 'assets/icons/loading.svg';
import loading_white from 'assets/icons/loading_white.svg';

import Radium from 'radium';

function IconSVG(props) {
  let icon;
  let iconHover;
  let borderRadius;
  switch (props.name) {
    case 'dialpad':
      icon = dialpad;
      borderRadius = '50%';
      break;
    case 'loading':
      icon = loading;
      borderRadius = '50%';
      break;
    case 'loading_white':
      icon = loading_white;
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
    <ReactSVG
      id={props.id}
      path={icon}
      evalScript="always"
      style={Object.assign(styles.base, props.style ? props.style : {})}
    />
  );
}

IconSVG.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default Radium(IconSVG);
