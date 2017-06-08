/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Logo
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

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
    <img
      src={logo}
      alt="Logo"
      style={[{ width: props.width, height: props.height }, props.style]}
    />
  );
}

Logo.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
};


export default Radium(Logo);
