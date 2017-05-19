/*
 *
 * Toolbar actions
 *
 */

import {
  SET_AVAILABLE_STATS,
  TOGGLE_STAT,
  STATS_RECEIVED,
  SHOW_AGENT_MENU,
  REMOVE_STAT,
  ADD_STAT,
} from './constants';

export function setAvailableStats(stats, tenantId, userId) {
  return {
    type: SET_AVAILABLE_STATS,
    stats,
    tenantId,
    userId,
  };
}

export function toggleAgentMenu(show) {
  return {
    type: SHOW_AGENT_MENU,
    show,
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

export function removeStat(stat) {
  return {
    type: REMOVE_STAT,
    stat,
  };
}

export function addStat(stat) {
  return {
    type: ADD_STAT,
    stat,
  };
}
