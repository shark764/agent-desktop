/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentNotificationsMenu reducer
 *
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  audioNotifications: true,
  visualNotifications: true,
};

const notificationPreferencesSlice = createSlice({
  name: 'notificationPreferences',
  initialState,
  reducers: {
    setAudioNotificationsPreference(state, action) {
      state.audioNotifications = action.payload;
    },

    setVisualNotificationsPreference(state, action) {
      state.visualNotifications = action.payload;
    },
  },
});

export const {
  setAudioNotificationsPreference,
  setVisualNotificationsPreference,
} = notificationPreferencesSlice.actions;

export default notificationPreferencesSlice;
