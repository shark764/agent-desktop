/**
*
* A
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

function A(props) {
  return (
    <span style={Object.assign({}, { textDecoration: 'underline', color: '#494949' }, props.style)}>
      <FormattedMessage {...props.text} />
    </span>
  );
}

A.propTypes = {
  style: PropTypes.object,
  text: PropTypes.object,
};


export default A;
