/**
*
* CircleIconButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Icon from 'components/Icon';

const styles = {
  base: {
    border: 'none',
    borderRadius: '50%',
    outline: 'none',
    padding: 0,
    ':focus': {
      border: 'none',
    },
  },
  icon: {
    margin: 'none',
  },
};

function CircleIconButton(props) {
  return (
    <button id={props.id} style={[styles.base, props.style]} onClick={props.onClick}>
      <Icon id={`${props.id}-icon`} name={props.name} active={props.active} style={[styles.base, props.style, styles.icon]} />
    </button>
  );
}

CircleIconButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default Radium(CircleIconButton);
