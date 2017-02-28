/**
*
* A
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

const styles = {
  active: {
    textDecoration: 'underline',
    color: '#494949',
    cursor: 'pointer',
  },
  disabled: {
    textDecoration: 'underline',
    color: '#979797',
  },
};

function A(props) {
  return (
    <a id={props.id} style={Object.assign({}, props.disabled ? styles.disabled : styles.active, props.style)} tabIndex={props.tabIndex} onClick={props.disabled ? null : props.onClick} >
      {typeof props.text === 'string' ? props.text : <FormattedMessage {...props.text} />}
    </a>
  );
}

A.propTypes = {
  style: PropTypes.object,
  text: React.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
};


export default A;
