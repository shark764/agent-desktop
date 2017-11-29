/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * StatValue
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import TimeStat from 'components/TimeStat';

function StatValue(props) {
  let value;
  if (props.stat.isErrored) {
    value = '-';
  } else {
    let percent;
    switch (props.stat.statAggregate) {
      case 'count':
        value = props.stat.results.count;
        break;
      case 'percent':
        percent = props.stat.results.percent;
        value = `${percent}%`;
        break;
      case 'avg':
      case 'max':
      case 'min':
      case 'total':
        value = (
          <TimeStat
            time={props.stat.results[props.stat.statAggregate]}
            unit="millis"
          />
        );
        break;
      default:
        console.warn(
          '[Agent Desktop] Agent statistic has unknown aggregate key.'
        );
        value = '-';
    }
  }
  return <span>{value}</span>;
}

StatValue.propTypes = {
  stat: PropTypes.object.isRequired,
};

export default StatValue;
