/**
*
* Icon
*
*/

import React, { PropTypes } from 'react';
import ReactSVG from 'react-svg';
import dialpad from 'assets/icons/dialpad.svg';

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
      callback={(svg) => console.log(svg)}
      evalScript="always"
      style={[props.style, styles.base]}
    />
  );
}

IconSVG.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default Radium(IconSVG);
