import { createSelector } from 'reselect';

/**
* Other specific selectors
*/

const selectToolbarDomain = (state) => state.get('toolbar');

const selectEnabledStats = createSelector(
  selectToolbarDomain,
  (toolbar) => toolbar.get('enabledStats').toJS()
);

const selectAvailableStats = createSelector(
  selectToolbarDomain,
  (toolbar) => toolbar.get('availableStats').toJS()
);

export {
  selectEnabledStats,
  selectAvailableStats,
};
