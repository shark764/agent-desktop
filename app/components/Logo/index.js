/**
*
* Logo
*
*/

import React, { PropTypes } from 'react';

import serenova from './Serenova.png';
import mitel from './Mitel.png';

function Logo(props) {
  const parts = location.hostname.split('.');
  let logo;
  if (parts[0].indexOf('mitel') !== -1) {
    logo = mitel;
  } else {
    logo = serenova;
  }

  return (
    <img src={logo} alt="Logo" style={Object.assign({ width: props.width, height: props.height }, props.style)} />
  );
}

Logo.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
};


export default Logo;
