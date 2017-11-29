/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

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
  let duration;
  if (props.timeSince !== undefined) {
    duration = props.timer.timestamp - props.timeSince;
  } else {
    duration = props.timer.tick * 1000;
  }
  const time = moment.duration(duration);
  return (
    <span style={props.style}>
      {moment.utc(time.asMilliseconds()).format(format)}
    </span>
  );
}

Timer.propTypes = {
  timer: PropTypes.object,
  timeSince: PropTypes.number,
  format: PropTypes.string,
  style: PropTypes.object,
};

export default timer(1000)(Timer);
