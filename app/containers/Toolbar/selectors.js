import { createSelector } from 'reselect';
import { selectErroredStatIds } from 'containers/Errors/selectors';
import { statKey as welcomeStatKey } from 'containers/WelcomeStats/welcomeStatsConfig';

/**
 * Direct selector to the toolbar state domain
 */
const selectToolbarDomain = () => (state) => state.get('toolbar');

/**
 * Other specific selectors
 */

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectQueues = createSelector(
   selectAgentDesktopDomain,
   (agentDesktop) => agentDesktop.get('queues').toJS()
 );

const selectLoginDomain = (state) => state.get('login');

const selectCurrentAgent = createSelector(
  selectLoginDomain,
  (login) => login.get('agent').toJS()
);

/**
 * Default selector used by Toolbar
 */

const selectToolbar = () => createSelector(
  selectToolbarDomain(),
  (substate) => substate.toJS()
);

const selectToolbarStatIds = () => createSelector(
  selectToolbarDomain(),
  (toolbar) => toolbar.get('toolbarStatIds'),
);

const selectWelcomeStatIds = () => createSelector(
  selectToolbarDomain(),
  (toolbar) => toolbar.get('welcomeStatIds'),
);

const selectEnabledStats = () => createSelector(
  selectToolbarDomain(),
  selectErroredStatIds,
  (toolbar, erroredStatIds) => toolbar.get('enabledStats').map((stat) => stat.set('isErrored', erroredStatIds.includes(stat.get('statId')))),
);

const selectToolbarStats = createSelector(
  selectToolbarStatIds(),
  selectEnabledStats(),
  (toolbarStatIds, enabledStats) => enabledStats.toJS().filter((stat) => toolbarStatIds.includes(stat.statId))
);

const selectWelcomeStats = createSelector(
  selectWelcomeStatIds(),
  selectEnabledStats(),
  (welcomeStatIds, enabledStats) => {
    const welcomeStats = {};
    enabledStats.toJS().forEach((stat) =>
      welcomeStatIds.includes(stat.statId)
      && (welcomeStats[stat[welcomeStatKey]] = stat)
    );
    return welcomeStats;
  }
);

const selectActivatedStatIds = createSelector(
  selectToolbarStatIds(),
  selectWelcomeStatIds(),
  (toolbarStatIds, welcomeStatIds) => toolbarStatIds.concat(welcomeStatIds)
);


export default selectToolbar;
export {
  selectToolbarDomain,
  selectToolbarStats,
  selectWelcomeStats,
  selectQueues,
  selectCurrentAgent,
  selectToolbarStatIds,
  selectWelcomeStatIds,
  selectActivatedStatIds,
};
