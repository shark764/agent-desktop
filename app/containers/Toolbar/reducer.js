/*
 *
 * Toolbar reducer
 *
 */

import { fromJS } from 'immutable';
import statEqualityCheck from 'utils/statEqualityCheck';
import {
  SET_AVAILABLE_STATS,
  STATS_RECEIVED,
  SHOW_AGENT_MENU,
  REMOVE_STAT,
  ADD_STAT,
} from './constants';

const initialState = fromJS({
  enabledStats: [],
  availableStats: {},
  showAgentStatusMenu: false,
});

function toolbarReducer(state = initialState, action) {
  let currentStats;
  let enabledStatId;
  let cleanStats;

  switch (action.type) {
    case SHOW_AGENT_MENU:
      return state
        .set('showAgentStatusMenu', action.show);
    case SET_AVAILABLE_STATS:
      return state
        .set('availableStats', fromJS(action.stats));
    case REMOVE_STAT:
      currentStats = state.get('enabledStats').toJS();
      return state
        .set('enabledStats', fromJS(currentStats.filter((item) => !statEqualityCheck(item, action.stat))));
    case ADD_STAT:
      currentStats = state.get('enabledStats').toJS();
      return state
        .set('enabledStats', fromJS([action.stat, ...currentStats]));
    case STATS_RECEIVED:
      cleanStats = {};
      Object.keys(action.stats).forEach((statKey) => {
        cleanStats[statKey.toLowerCase()] = action.stats[statKey];
      });
      return state.update('enabledStats', (enabledStats) =>
        enabledStats.map((enabledStat) => {
          enabledStatId = enabledStat.get('statId');
          if (cleanStats[enabledStatId]) {
            return enabledStat.set('results', fromJS(cleanStats[enabledStatId].body.results));
          }
          return enabledStat;
        })
      );
    default:
      return state;
  }
}

export default toolbarReducer;
