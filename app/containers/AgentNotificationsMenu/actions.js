/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentNotificationsMenu actions
 *
 */

import * as ACTIONS from './constants';

// Reducer actions

export function setAudioNotificationsPreference(audioNotifications) {
  return {
    type: ACTIONS.SET_AUDIO_NOTIFICATIONS_PREFERENCE,
    audioNotifications,
  };
}

export function setVisualNotificationsPreference(visualNotifications) {
  return {
    type: ACTIONS.SET_VISUAL_NOTIFICATIONS_PREFERENCE,
    visualNotifications,
  };
}

// Saga actions

export function initializeNotificatonPreferences() {
  return {
    type: ACTIONS.INITIALIZE_NOTIFICATION_PREFERENCES,
  };
}

export function toggleAudioNotificationsPreference() {
  return {
    type: ACTIONS.TOGGLE_AUDIO_NOTIFICATIONS_PREFERENCE,
  };
}

export function toggleVisualNotificationsPreference() {
  return {
    type: ACTIONS.TOGGLE_VISUAL_NOTIFICATIONS_PREFERENCE,
  };
}
