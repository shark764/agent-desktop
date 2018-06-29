/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Scale
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

function Scale(props) {
  const styles = {
    placeholder: {
      marginBottom: '3px',
    },
    cell: {
      paddingRight: '10px',
      position: 'relative',
      height: '35px',
      display: 'inline-block',
    },
    label: {
      position: 'absolute',
      top: '15px',
      left: '-4px',
      width: '20px',
      textAlign: 'center',
    },
  };

  const scaleRadios = [];
  for (let i = props.lowerBound; i <= props.upperBound; i += 1) {
    scaleRadios.push(
      <span key={`${props.id}-${i}`} style={styles.cell}>
        <input
          id={`${props.id}-${i}-radio`}
          type="radio"
          checked={props.value === i}
          onChange={() => props.onChange(i)}
        />
        <label
          id={`${props.id}-${i}-label`}
          htmlFor={`${props.id}-${i}-radio`}
          style={styles.label}
        >
          {i}
        </label>
      </span>
    );
  }
  return (
    <div id={props.id} key={props.id} style={props.style}>
      <div style={styles.placeholder}>
        {props.placeholder}
      </div>
      <div>
        <span style={styles.cell}>
          {props.lowerBoundLabel}
        </span>
        {scaleRadios}
        <span style={styles.cell}>
          {props.upperBoundLabel}
        </span>
      </div>
    </div>
  );
}

Scale.propTypes = {
  id: PropTypes.string.isRequired,
  lowerBound: PropTypes.number.isRequired,
  lowerBoundLabel: PropTypes.string,
  upperBound: PropTypes.number.isRequired,
  upperBoundLabel: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

export default Radium(Scale);
