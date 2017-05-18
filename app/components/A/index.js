/**
*
* A
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

const styles = {
  base: {
    textDecoration: 'underline',
  },
  active: {
    color: '#494949',
    cursor: 'pointer',
  },
  disabled: {
    color: '#979797',
  },
};

function A(props) {
  return (
    <a
      id={props.id}
      style={[
        styles.base,
        props.disabled ? styles.disabled : styles.active,
        props.style,
      ]}
      tabIndex={props.tabIndex}
      onClick={props.disabled ? null : props.onClick}
    >
      {typeof props.text === 'string' ? props.text : <FormattedMessage {...props.text} />}
    </a>
  );
}

A.propTypes = {
  style: PropTypes.object,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

export default Radium(A);
