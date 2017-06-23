/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* TextLink
*
*/

import React from 'react';
import PropTypes from 'prop-types';

function TextLink(props) {
  return (
    <div id={props.id} style={props.style}>
      <a href={props.link} target="_blank">
        {props.text}
      </a>
    </div>
  );
}

TextLink.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default TextLink;
