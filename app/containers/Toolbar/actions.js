/*
 *
 * Toolbar actions
 *
 */

import {
  SET_AVAILABLE_STATS,
  TOGGLE_STAT,
  STATS_RECEIVED,
} from './constants';

export function setAvailableStats(stats, tenantId, userId) {
  return {
    type: SET_AVAILABLE_STATS,
    stats,
    tenantId,
    userId,
  };
}

export function toggleStat(stat, userId, queues, saved) {
  return {
    type: TOGGLE_STAT,
    stat,
    userId,
    queues,
    saved,
  };
}

export function statsReceived(stats) {
  return {
    type: STATS_RECEIVED,
    stats,
  };
}
