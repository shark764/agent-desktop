/**
*
* TimerMinutes
*
*/

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

function TimerMinutes({ seconds }) { // eslint-disable-line
  const minutes = Math.round(seconds / 60);
  let timeDisplay;
  let timeUnit;
  if (minutes < 1) {
    timeDisplay = <FormattedMessage {...messages.justNow} />;
    timeUnit = '';
  } else if (minutes < 60) {
    timeDisplay = minutes;
    timeUnit = <FormattedMessage {...messages.minutes} />;
  } else {
    timeDisplay = Math.floor(minutes / 60);
    timeUnit = <FormattedMessage {...messages.hours} />;
  }
  return (
    <span>{ timeDisplay }{ timeUnit }</span>
  );
}

TimerMinutes.propTypes = {
  seconds: PropTypes.number,
};

export default TimerMinutes;
