/**
*
* A
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

function A(props) {
  return (
    <a id={props.id} style={Object.assign({}, { textDecoration: 'underline', color: '#494949', cursor: 'pointer' }, props.style)} tabIndex={props.tabIndex} onClick={props.onClick} >
      <FormattedMessage {...props.text} />
    </a>
  );
}

A.propTypes = {
  style: PropTypes.object,
  text: PropTypes.object,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  id: PropTypes.string.isRequired,
};


export default A;
