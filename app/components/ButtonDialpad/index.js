/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ButtonDialpad
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/Button';

export const possibleTypes = [
  'topLeft',
  'top',
  'topRight',
  'left',
  'right',
  'bottomLeft',
  'bottom',
  'bottomRight',
  'middle',
];

const styles = {
  base: {
    color: '#4B4B4B',
    width: '33.3%',
    fontSize: '22px',
    padding: '17px 0',
    borderTop: 'none',
    borderRight: '1px solid #E4E4E4',
    borderBottom: '1px solid #E4E4E4',
    borderLeft: 'none',
    borderRadius: 0,
  },
  top: {
    borderTop: '1px solid #E4E4E4',
  },
  left: {
    borderLeft: '1px solid #E4E4E4',
  },
  topLeft: {
    borderRadius: '3px 0 0 0',
  },
  topRight: {
    borderRadius: '0 3px 0 0',
  },
  bottomRight: {
    borderRadius: '0 0 3px 0',
  },
  bottomLeft: {
    borderRadius: '0 0 0 3px',
  },
};

function ButtonDialpad(props) {
  return (
    <Button
      id={props.id}
      style={[
        styles.base,
        styles[props.type],
        props.type.includes('top') && styles.top,
        props.type.includes('Left') && styles.left,
      ]}
      type="secondary"
      text={props.text}
      onClick={props.onClick}
    />
  );
}

ButtonDialpad.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(possibleTypes).isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default ButtonDialpad;
