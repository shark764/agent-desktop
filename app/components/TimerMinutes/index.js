/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * TimerMinutes
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import timer from 'react-timer-hoc';

import messages from './messages';

export function TimerMinutes(props) {
  const minutes = Math.round((props.timer.timestamp - props.timeSince) / 60000);
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
    <span>
      {timeDisplay}
      {timeUnit}
    </span>
  );
}

TimerMinutes.propTypes = {
  timer: PropTypes.object.isRequired,
  timeSince: PropTypes.number.isRequired,
};

export default timer(1000)(TimerMinutes);
