/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { isIeEleven } from 'serenova-js-utils/browser';

const selectNotificationPreferences = (state) =>
  state.get('notificationPreferences');

export const selectAudioPreferences = (state) =>
  selectNotificationPreferences(state).get('audioNotifications');

export const selectVisualPreferences = (state) =>
  !isIeEleven() &&
  Notification.permission === 'granted' &&
  selectNotificationPreferences(state).get('visualNotifications');
