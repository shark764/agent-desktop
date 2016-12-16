/*
 *
 * Toolbar actions
 *
 */

import {
  DEFAULT_ACTION,
  SHOW_AGENT_STATUS_MENU,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function showAgentStatusMenu(show) {
  return {
    type: SHOW_AGENT_STATUS_MENU,
    show,
  };
}
