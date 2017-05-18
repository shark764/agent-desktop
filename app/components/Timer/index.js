/**
*
* Timer
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import timer from 'react-timer-hoc';
import moment from 'moment';

function Timer(props) {
  let format = props.format;
  if (!props.format) {
    format = 'HH:mm:ss';
  }
  const time = moment.duration(props.timer.tick * 1000);
  return (
    <span style={props.style}>
      {moment.utc(time.asMilliseconds()).format(format)}
    </span>
  );
}

Timer.propTypes = {
  timer: PropTypes.object,
  format: PropTypes.string,
  style: PropTypes.object,
};

export default timer(1000)(Timer);
