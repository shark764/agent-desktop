/*
 *
 * Toolbar reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_AVAILABLE_STATS,
  TOGGLE_STAT,
  STATS_RECEIVED,
  SET_STAT_ID,
} from './constants';

let localStorageKey;
let savedStats;

const initialState = fromJS({
  enabledStats: [],
  availableStats: {},
});

function toolbarReducer(state = initialState, action) {
  let currentStats;
  let availableStats;
  let enabledStatId;
  let cleanStats;
  let newStat;

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
      availableStats = state.get('availableStats').toJS();
      if (currentStats.filter((item) => statEqualityCheck(item, action.stat)).length) {
        savedStats = savedStats.filter((item) => !statEqualityCheck(item, action.stat));
        window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
        SDK.reporting.removeStatSubscription({ statId: action.stat.statId });
        return state
          .set('enabledStats', fromJS(currentStats.filter((item) => !statEqualityCheck(item, action.stat))));
      } else {
        newStat = action.stat;
        savedStats.push(newStat);
        window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
        let statRequestBody;
        if (newStat.statSource === 'resource-id') {
          statRequestBody = { statistic: availableStats[newStat.statOption].name, resourceId: action.userId };
        } else if (newStat.statSource === 'queue-id') {
          statRequestBody = { statistic: availableStats[newStat.statOption].name, queueId: newStat.queue };
        } else {
          statRequestBody = { statistic: availableStats[newStat.statOption].name };
        }
        SDK.reporting.addStatSubscription(statRequestBody, (err, topics, res) => {
          newStat.statId = res.statId;
        });
        return state
          .set('enabledStats', fromJS([newStat, ...currentStats]));
      }
    case SET_STAT_ID:
      return state
        .setIn(['enabledStats', action.statIndex, 'statId'], action.statId);
    case STATS_RECEIVED:
      cleanStats = {};
      Object.keys(action.stats).forEach((statKey) => {
        cleanStats[statKey.toLowerCase()] = action.stats[statKey];
      });
      return state.update('enabledStats', (enabledStats) =>
        enabledStats.map((enabledStat) => {
          enabledStatId = enabledStat.get('statId').split('-').join('');
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

function statEqualityCheck(stat1, stat2) {
  if (stat1.statSource === 'queue-id' && stat2.statSource === 'queue-id') {
    return stat1.statSource === stat2.statSource && stat1.statAggregate === stat2.statAggregate && stat1.statOption === stat2.statOption && stat1.queue === stat2.queue;
  }
  return stat1.statSource === stat2.statSource && stat1.statAggregate === stat2.statAggregate && stat1.statOption === stat2.statOption;
}

export default toolbarReducer;
