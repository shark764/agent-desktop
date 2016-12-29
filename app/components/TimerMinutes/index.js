/**
*
* Timer
*
*/

import React, { PropTypes } from 'react';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import timer from 'react-timer-hoc';

function TimerMinutes({ timer }) { // eslint-disable-line
  const time = timer.tick;
  let timeDisplay;
  let timeUnit;
  if (time < 1) {
    timeDisplay = <FormattedMessage {...messages.justNow} />;
    timeUnit = '';
  } else if (time < 60) {
    timeDisplay = time;
    timeUnit = <FormattedMessage {...messages.minutes} />;
  } else {
    timeDisplay = Math.floor(time / 60);
    timeUnit = <FormattedMessage {...messages.hours} />;
  }
  return (
    <span>{ timeDisplay }{ timeUnit }</span>
  );
}

TimerMinutes.propTypes = {
  timer: PropTypes.object,
};

export default timer(60000)(TimerMinutes);
