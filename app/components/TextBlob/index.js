/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * TextBlob
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

function TextBlob(props) {
  return (
    <div id={props.id} style={props.style}>
      {props.text}
    </div>
  );
}

TextBlob.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default TextBlob;
