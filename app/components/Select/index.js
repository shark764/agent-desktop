/**
*
* Select
*
*/

import React, { PropTypes, Children } from 'react';

import Radium from 'radium';

function Select(props) {
  const styles = {
    base: {
      height: '44px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #979797',
      borderRadius: '2px',
    },
  };

  return (
    <select style={[styles.base, props.style]} onChange={props.onChange}>
      {Children.toArray(props.children)}
    </select>
  );
}

Select.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  onChange: PropTypes.func,
};

export default Radium(Select);
