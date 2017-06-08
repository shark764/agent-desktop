/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Icon
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

import dialpad from 'assets/icons/dialpad.svg';
import loading from 'assets/icons/loading.svg';
import loadingWhite from 'assets/icons/loading_white.svg';
import add from 'assets/icons/add.svg';
import close from 'assets/icons/close.svg';

export const availableIcons = [
  'dialpad',
  'loading',
  'loadingWhite',
  'add',
  'close',
];

const styles = {
  base: {
    borderRadius: '50%',
  },
};

function IconSVG(props) {
  let icon;
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

  return (
    <div style={props.styleOuter}>
      <ReactSVG
        id={props.id}
        path={icon}
        evalScript="always"
        style={Object.assign({}, styles.base, props.style ? props.style : {})}
      />
    </div>
  );
}

IconSVG.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.oneOf(availableIcons).isRequired,
  style: PropTypes.object,
  // styleOuter used because ReactSVG wraps <svg style={props.style}> in two layers of <div>s
  styleOuter: PropTypes.object,
};

export default IconSVG;
