/**
*
* ButtonDialpad
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Button from 'components/Button';

function ButtonDialpad(props) {
  let borderTop = 'none';
  let borderLeft = 'none';
  let borderRadius = 0;

  if (props.type.includes('top')) {
    borderTop = '1px solid #E4E4E4';
  }
  if (props.type === 'left' || props.type.includes('Left')) {
    borderLeft = '1px solid #E4E4E4';
  }

  if (props.type === 'topLeft') {
    borderRadius = '3px 0 0 0';
  } else if (props.type === 'topRight') {
    borderRadius = '0 3px 0 0';
  } else if (props.type === 'bottomRight') {
    borderRadius = '0 0 3px 0';
  } else if (props.type === 'bottomLeft') {
    borderRadius = '0 0 0 3px';
  }

  const styles = {
    base: {
      color: '#4B4B4B',
      width: '33.3%',
      fontSize: '22px',
      padding: '17px 0',
      borderTop,
      borderRight: '1px solid #E4E4E4',
      borderBottom: '1px solid #E4E4E4',
      borderLeft,
      borderRadius,
    },
  };

  return (
    <Button id={props.id} style={styles.base} type="secondary" text={props.text} onClick={props.onClick} />
  );
}

ButtonDialpad.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['topLeft', 'top', 'topRight', 'left', 'right', 'bottomLeft', 'bottom', 'bottomRight', 'middle']).isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default Radium(ButtonDialpad);
