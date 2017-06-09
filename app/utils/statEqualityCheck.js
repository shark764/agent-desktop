/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

export default function statEqualityCheck(stat1, stat2) {
  if (stat1.statSource === 'queue-id' && stat2.statSource === 'queue-id') {
    return stat1.statSource === stat2.statSource && stat1.statAggregate === stat2.statAggregate && stat1.statOption === stat2.statOption && stat1.queue === stat2.queue;
  }
  return stat1.statSource === stat2.statSource && stat1.statAggregate === stat2.statAggregate && stat1.statOption === stat2.statOption;
}
