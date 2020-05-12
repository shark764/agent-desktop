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
import timerHOC from 'react-timer-hoc';
import moment from 'moment';

export function Timer({ format = 'HH:mm:ss', timer, timeSince, style }) {
  const time = moment.duration(timer.timestamp - timeSince);
  return (
    <span style={style}>
      {moment.utc(time.asMilliseconds()).format(format)}
    </span>
  );
}

Timer.propTypes = {
  timer: PropTypes.object.isRequired,
  timeSince: PropTypes.number.isRequired,
  format: PropTypes.string,
  style: PropTypes.object,
};

export default timerHOC(1000)(Timer);
