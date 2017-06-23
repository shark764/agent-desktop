/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* FontAwesomeIcon
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import 'font-awesome/css/font-awesome.css';

function FontAwesomeIcon(props) {
  return (
    <i
      id={props.id ? props.id : `${props.name}-icon`}
      className={`fa fa-${props.name} fa-${props.faSize ? props.faSize : '2'}x`}
      style={props.style}
      onClick={props.onclick}
      alt={props.alt || props.name}
    />
  );
}

FontAwesomeIcon.propTypes = {
  name: PropTypes.string.isRequired,
  faSize: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string.isRequired,
  onclick: PropTypes.func,
};

export default Radium(FontAwesomeIcon);
