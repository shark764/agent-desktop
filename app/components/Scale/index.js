/**
*
* Scale
*
*/

import React, { PropTypes } from 'react';

function Scale(props) {
  const scaleRadios = [];
  for (let i = props.lowerBound; i <= props.upperBound; i += 1) {
    scaleRadios.push(
      <span key={`${props.id}-${i}`}>
        <input id={`${props.id}-${i}-radio`} type="radio" checked={props.value === i} onChange={() => props.onChange(i)} />
        <label id={`${props.id}-${i}-label`} htmlFor={`${props.id}-${i}-radio`}>
          { i }
        </label>
      </span>
    );
  }
  return (
    <div id={props.id} key={props.id} style={props.style}>
      <div>
        { props.placeholder }
      </div>
      <div>
        <span>
          { props.lowerBoundLabel }
        </span>
        { scaleRadios }
        <span>
          { props.upperBoundLabel }
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

export default (Scale);
