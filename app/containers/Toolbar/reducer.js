/*
 *
 * Toolbar reducer
 *
 */

import { fromJS, Map } from 'immutable';
import {
  SET_AVAILABLE_STATS,
  TOGGLE_STAT,
  STATS_RECEIVED,
} from './constants';

let localStorageKey;
let savedStats;

const initialState = fromJS({
  enabledStats: [],
  availableStats: {},
});

function toolbarReducer(state = initialState, action) {
  let currentStats;
  let cleanStats;

  switch (action.type) {
    case SET_AVAILABLE_STATS:
      localStorageKey = `agentDesktopStats.${action.tenantId}.${action.userId}`;
      savedStats = window.localStorage.getItem(localStorageKey) || '[]';
      return state
        .set('availableStats', fromJS(action.stats))
        .set('enabledStats', fromJS(JSON.parse(savedStats)));
    case TOGGLE_STAT:
      savedStats = window.localStorage.getItem(localStorageKey) || '[]';
      savedStats = JSON.parse(savedStats);
      currentStats = state.get('enabledStats').toJS();
      if (currentStats.filter((item) => statEqualityCheck(item, action.stat)).length) {
        savedStats = savedStats.filter((item) => !statEqualityCheck(item, action.stat));
        startPoll(savedStats, state.get('availableStats').toJS(), action.userId);
        window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
        return state
          .set('enabledStats', fromJS(currentStats.filter((item) => !statEqualityCheck(item, action.stat))));
      } else {
        savedStats.push(action.stat);
        startPoll(savedStats, state.get('availableStats').toJS(), action.userId);
        window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
        return state
          .set('enabledStats', fromJS([action.stat, ...currentStats]));
      }
    case STATS_RECEIVED:
      cleanStats = new Map();
      Object.keys(action.stats).forEach((key) => {
        let statName = key;
        let uuid;
        if (statName.indexOf('.') !== -1) {
          uuid = statName.split('.')[1].toLowerCase();
          statName = statName.split('.')[0];
          cleanStats = cleanStats.setIn([statName, `results.${uuid}`], action.stats[key].body.results);
        } else {
          cleanStats = cleanStats.setIn([statName, 'results'], action.stats[key].body.results);
        }
      });
      return state
        .mergeDeepIn(['availableStats'], cleanStats);
    default:
      return state;
  }
}

function statEqualityCheck(stat1, stat2) {
  return stat1.statSource === stat2.statSource && stat1.statAggregate === stat2.statAggregate && stat1.statOption === stat2.statOption;
}

export function startPoll(enabledStats, availableStats, currentAgent) {
  const interval = window.ADconf ? window.ADconf.refreshRate : 10000;
  const stats = {};
  enabledStats.forEach((stat) => {
    if (stat.statSource === 'resource-id') {
      stats[`${stat.statOption}.${currentAgent}`] = { statistic: availableStats[stat.statOption].name, resourceId: currentAgent };
    } else if (stat.statSource === 'queue-id') {
      stats[`${stat.statOption}.${stat.queue}`] = { statistic: availableStats[stat.statOption].name, resourceId: stat.queue };
    } else {
      stats[stat.statOption] = { statistic: availableStats[stat.statOption].name };
    }
  });
  SDK.reporting.stopPolling({}, () => {
    if (enabledStats.length) {
      SDK.reporting.startPolling({
        interval,
        stats,
      });
    }
  });
}

export default toolbarReducer;
