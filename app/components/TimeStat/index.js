/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * TimeStat
 *
 */

import React from 'react';
import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';

import PropTypes from 'prop-types';

import Radium from 'radium';

import messages from './messages';

function TimeStat(props) {
  const ms = moment.duration(props.time);
  let value = moment.utc(ms.asMilliseconds()).format('HH:mm:ss');
  let timeUnit;
  if (props.unit === 'millis') {
    if (value.slice(0, 5) === '00:00') {
      let seconds = value.slice(6);
      if (seconds.slice(0, 1) === '0') {
        seconds = seconds.slice(1);
      }
      timeUnit = props.intl.formatMessage(
        messages.secondsOneLetterAbbreviation
      );
      value = `${seconds}${timeUnit}`;
    } else if (value.slice(0, 2) === '00') {
      value = value.slice(3);
    }
  } else {
    throw new Error('Not handling time not in millis');
  }

  return (
    <div style={props.style}>
      {value}
    </div>
  );
}

TimeStat.propTypes = {
  intl: intlShape,
  style: PropTypes.array,
  time: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
};

export default injectIntl(Radium(TimeStat));
