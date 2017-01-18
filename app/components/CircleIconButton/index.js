/**
*
* CircleIconButton
*
*/

import React, { PropTypes } from 'react';
import Radium from 'radium';

import Icon from 'components/Icon';

function CircleIconButton(props) {
  const styles = {
    base: {
      borderRadius: '50%',
      height: '39px',
      width: '39px',
      outline: 'none',
    },
  };

  return (
    <button id={props.id} style={[styles.base, props.style]} onClick={props.onClick}>
      <Icon id={`${props.id}-icon'`}name={props.name} />
    </button>
  );
}

CircleIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
};

export default Radium(CircleIconButton);
