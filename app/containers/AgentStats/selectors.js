import { createSelector } from 'reselect';

/**
* Other specific selectors
*/

const selectToolbarDomain = (state) => state.get('toolbar');
const selectLoginDomain = (state) => state.get('login');

const selectEnabledStats = createSelector(
  selectToolbarDomain,
  (toolbar) => toolbar.get('enabledStats').toJS()
);

const selectAvailableStats = createSelector(
  selectToolbarDomain,
  (toolbar) => toolbar.get('availableStats').toJS()
);

const selectCurrentAgent = createSelector(
  selectLoginDomain,
  (login) => login.get('agent').toJS()
);

export {
  selectEnabledStats,
  selectAvailableStats,
  selectCurrentAgent,
};
