/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

/**
 * Direct selector to the errors state domain
 */
const selectErrorsDomain = () => (state) => state.get('errors');

/**
 * Other specific selectors
 */

const selectStatsDomain = createSelector(
  selectErrorsDomain(),
  (substate) => substate.get('stats')
);

const selectCriticalError = createSelector(
  selectErrorsDomain(),
  (substate) =>
    substate.get('criticalError') && substate.get('criticalError').toJS()
);

const selectSessionEnded = createSelector(
  selectErrorsDomain(),
  (substate) =>
    substate.get('sessionEnded') && substate.get('sessionEnded').toJS()
);

const selectNonCriticalError = createSelector(
  selectErrorsDomain(),
  (substate) =>
    substate.get('nonCriticalError') && substate.get('nonCriticalError').toJS()
);

const selectErroredStatIds = createSelector(
  selectStatsDomain,
  (substate) => substate.get('erroredIds').toJS()
);

export {
  selectCriticalError,
  selectNonCriticalError,
  selectErroredStatIds,
  selectSessionEnded,
};
