/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Toolbar actions
 *
 */

import * as ACTIONS from './constants';

export function setAvailableStats(stats) {
  return {
    type: ACTIONS.SET_AVAILABLE_STATS,
    stats,
  };
}

export function toggleAgentMenu(show) {
  return {
    type: ACTIONS.SHOW_AGENT_MENU,
    show,
  };
}

export function statsReceived(stats) {
  return {
    type: ACTIONS.STATS_RECEIVED,
    stats,
  };
}

export function removeStat(stat) {
  return {
    type: ACTIONS.REMOVE_STAT,
    stat,
  };
}

export function addStat(stat) {
  return {
    type: ACTIONS.ADD_STAT,
    stat,
  };
}

export function removeToolbarStatId(statId) {
  return {
    type: ACTIONS.REMOVE_TOOLBAR_STAT_ID,
    statId,
  };
}

export function addToolbarStatId(statId) {
  return {
    type: ACTIONS.ADD_TOOLBAR_STAT_ID,
    statId,
  };
}

export function addWelcomeStatId(statId) {
  return {
    type: ACTIONS.ADD_WELCOME_STAT_ID,
    statId,
  };
}

export function activateToolbarStat(stat) {
  return {
    type: ACTIONS.ACTIVATE_TOOLBAR_STAT,
    stat,
  };
}

export function deactivateToolbarStat(stat) {
  return {
    type: ACTIONS.DEACTIVATE_TOOLBAR_STAT,
    stat,
  };
}

export function initializeStats() {
  return {
    type: ACTIONS.INITIALIZE_STATS,
  };
}

export function batchRequetsFailing(isFailing) {
  return {
    type: ACTIONS.BATCH_REQUEST_FAILING,
    isFailing,
  };
}
