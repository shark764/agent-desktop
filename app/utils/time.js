/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import moment from 'moment';

export const timeSince = (initialTime) => {
  if (!initialTime) {
    return '0s';
  }

  const secondsSince = moment(Date.now()).diff(moment(initialTime), 'seconds');
  if (secondsSince < 0) {
    return '0s';
  } else if (secondsSince < 60) {
    return `${secondsSince}s`;
  }

  const minutesSince = Math.floor(secondsSince / 60);
  if (minutesSince < 60) {
    return `${minutesSince}m`;
  }

  const hoursSince = Math.floor(minutesSince / 60);
  const remainderMinutesSince = minutesSince % 60;
  return `${hoursSince}h ${remainderMinutesSince}m`;
};
