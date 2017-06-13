/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Toolbar reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_AVAILABLE_STATS,
  STATS_RECEIVED,
  SHOW_AGENT_MENU,
  REMOVE_STAT,
  ADD_STAT,
  REMOVE_TOOLBAR_STAT_ID,
  ADD_TOOLBAR_STAT_ID,
  ADD_WELCOME_STAT_ID,
} from './constants';

const initialState = fromJS({
  welcomeStatIds: [],
  toolbarStatIds: [],
  enabledStats: [],
  availableStats: {},
  showAgentStatusMenu: false,
});

function toolbarReducer(state = initialState, action) {
  let enabledStatId;

  switch (action.type) {
    case SHOW_AGENT_MENU:
      return state
        .set('showAgentStatusMenu', action.show);
    case SET_AVAILABLE_STATS:
      return state
        .set('availableStats', fromJS(action.stats));
    case REMOVE_STAT:
      return state
        .update('enabledStats', (enabledStats) => fromJS(enabledStats.filter((currentStat) => currentStat.get('statId') !== action.stat.statId)));
    case ADD_STAT:
      return state
        .update('enabledStats', (enabledStats) => fromJS([action.stat, ...enabledStats.filter((currentStat) => currentStat.get('statId') !== action.stat.statId)]));
    case REMOVE_TOOLBAR_STAT_ID:
      return state
        .update('toolbarStatIds', (toolbarStatIds) => fromJS(toolbarStatIds.filter((statId) => statId !== action.statId)));
    case ADD_TOOLBAR_STAT_ID:
      return state
        .update('toolbarStatIds', (toolbarStatIds) => fromJS([...toolbarStatIds.filter((statId) => statId !== action.statId), action.statId]));
    case ADD_WELCOME_STAT_ID:
      return state
        .update('welcomeStatIds', (welcomeStatIds) => fromJS([...welcomeStatIds.filter((statId) => statId !== action.statId), action.statId]));
    case STATS_RECEIVED:
      return state.update('enabledStats', (enabledStats) =>
        enabledStats.map((enabledStat) => {
          enabledStatId = enabledStat.get('statId');
          if (action.stats[enabledStatId]) {
            return enabledStat.set('results', fromJS(action.stats[enabledStatId].body.results));
          }
          return enabledStat;
        })
      );
    default:
      return state;
  }
}

export default toolbarReducer;
