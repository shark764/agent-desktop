/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

const selectNotificationPreferences = (state) =>
  state.get('notificationPreferences');

export const selectAudioPreferences = (state) =>
  selectNotificationPreferences(state).audioNotifications;

export const selectVisualPreferences = (state) =>
  Notification.permission === 'granted' &&
  selectNotificationPreferences(state).visualNotifications;
