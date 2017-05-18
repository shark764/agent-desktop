import PropTypes from 'prop-types';
/**
*
* TextBlob
*
*/

import React from 'react';

function TextBlob(props) {
  return (
    <div id={props.id} style={props.style}>
      { props.text }
    </div>
  );
}

TextBlob.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default TextBlob;
