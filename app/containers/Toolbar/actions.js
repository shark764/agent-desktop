/*
 *
 * Toolbar actions
 *
 */

import {
  SET_AVAILABLE_STATS,
  TOGGLE_STAT,
  STATS_RECEIVED,
  SET_STAT_ID,
} from './constants';

export function setAvailableStats(stats, tenantId, userId) {
  return {
    type: SET_AVAILABLE_STATS,
    stats,
    tenantId,
    userId,
  };
}

export function toggleStat(stat, userId) {
  return {
    type: TOGGLE_STAT,
    stat,
    userId,
  };
}

export function setStatId(statIndex, statId) {
  return {
    type: SET_STAT_ID,
    statIndex,
    statId,
  };
}

export function statsReceived(stats) {
  return {
    type: STATS_RECEIVED,
    stats,
  };
}
