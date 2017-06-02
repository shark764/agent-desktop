/*
 *
 * Toolbar actions
 *
 */

import {
  SET_AVAILABLE_STATS,
  STATS_RECEIVED,
  SHOW_AGENT_MENU,
  REMOVE_STAT,
  ADD_STAT,
  ADD_WELCOME_STAT_ID,
  REMOVE_TOOLBAR_STAT_ID,
  ADD_TOOLBAR_STAT_ID,
  ACTIVATE_TOOLBAR_STAT,
  DEACTIVATE_TOOLBAR_STAT,
  INITIALIZE_STATS,
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

export function removeToolbarStatId(statId) {
  return {
    type: REMOVE_TOOLBAR_STAT_ID,
    statId,
  };
}

export function addToolbarStatId(statId) {
  return {
    type: ADD_TOOLBAR_STAT_ID,
    statId,
  };
}

export function addWelcomeStatId(statId) {
  return {
    type: ADD_WELCOME_STAT_ID,
    statId,
  };
}

export function activateToolbarStat(stat) {
  return {
    type: ACTIVATE_TOOLBAR_STAT,
    stat,
  };
}

export function deactivateToolbarStat(stat) {
  return {
    type: DEACTIVATE_TOOLBAR_STAT,
    stat,
  };
}

export function initializeStats() {
  return {
    type: INITIALIZE_STATS,
  };
}
