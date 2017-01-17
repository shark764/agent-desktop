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
    <button style={[styles.base, props.style]} onClick={props.onClick}>
      <Icon name={props.name} />
    </button>
  );
}

CircleIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Radium(CircleIconButton);
