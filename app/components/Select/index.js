/**
*
* Select
*
*/

import React, { PropTypes } from 'react';
import RSelect from 'react-select';
import './react-select.css';

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
    <RSelect
      style={Object.assign({}, styles.base, props.style)}
      onChange={props.onChange}
      name="form-field-name"
      value={props.value}
      options={props.options}
      autofocus={props.autoFocus}
    />
  );
}

Select.propTypes = {
  style: PropTypes.array,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default Radium(Select);
