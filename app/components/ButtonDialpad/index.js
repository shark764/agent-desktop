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
    verticalAlign: 'top',
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
  letter: {
    color: '#979797',
    fontSize: '10px',
    marginLeft: '3px',
  },
  baseLetter: {
    height: '35px',
    marginTop: '15px',
  },
  baseNumber: {
    marginLeft: '3px',
    marginTop: '-20px',
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
      onClick={props.onClick}
    >
      <div style={styles.baseLetter}>
        <div style={styles.baseNumber}>
          {props.text}
        </div>
        {props.subText && (
          <div style={styles.letter}>
            {props.subText}
          </div>
        )}
      </div>
    </Button>
  );
}

ButtonDialpad.propTypes = {
  text: PropTypes.string.isRequired,
  subText: PropTypes.string,
  type: PropTypes.oneOf(possibleTypes).isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default ButtonDialpad;
