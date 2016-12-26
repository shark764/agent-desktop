/**
*
* Timer
*
*/

import React, { PropTypes } from 'react';
import timer from 'react-timer-hoc';
import moment from 'moment';

function Timer({ timer }) { // eslint-disable-line
  const time = moment.duration(timer.tick * 1000);
  return (
    <span>
      {moment.utc(time.asMilliseconds()).format('HH:mm:ss')}
    </span>
  );
}

Timer.propTypes = {
  timer: PropTypes.object,
};

export default timer(1000)(Timer);
