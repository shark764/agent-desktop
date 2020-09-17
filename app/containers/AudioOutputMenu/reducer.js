/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AudioOutputMenu reducer -- (reduxjs/toolkit)
 *
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  availableOutputDevices: [],
  activeOutputRingtoneDevice: 'default',
  activeOutputSpeakerDevice: 'default',
  activeOutputNotificationDevice: 'default',
  isOutputSelectionSupported: false,
};

/**
 * Reducer created with createSlice
 * https://redux-toolkit.js.org/api/createSlice#createslice
 */
const audioOutputPreferencesSlice = createSlice({
  name: 'audioOutputPreferences',
  initialState,
  /**
   * Reducers
   * https://redux-toolkit.js.org/api/createSlice#reducers
   */
  reducers: {
    /**
     * Defining Action Creators with createAction
     * https://redux-toolkit.js.org/usage/usage-guide#defining-action-creators-with-createaction
     *
     * This will be rendered at Redux DevTools as:
     *    "audioOutputPreferences/setAvailableOutputDevices"
     */
    setAvailableOutputDevices(state, action) {
      state.availableOutputDevices = action.payload;
    },

    setActiveOutputRingtoneDevice(state, action) {
      state.activeOutputRingtoneDevice = action.payload;
    },

    setActiveOutputSpeakerDevice(state, action) {
      state.activeOutputSpeakerDevice = action.payload;
    },

    setActiveOutputNotificationDevice(state, action) {
      state.activeOutputNotificationDevice = action.payload;
    },

    /**
     * Is selection feature supported
     */
    setOutputSelectionSupported(state, action) {
      state.isOutputSelectionSupported = action.payload;
    },
  },
});

/**
 * createSlice will return an object like this:
 * {
 *    name : string,
 *    reducer : ReducerFunction,
 *    actions : Record<string, ActionCreator>,
 *    caseReducers: Record<string, CaseReducer>
 * }
 *
 * https://redux-toolkit.js.org/api/createSlice#return-value
 */
export const {
  setAvailableOutputDevices,
  setActiveOutputRingtoneDevice,
  setActiveOutputSpeakerDevice,
  setActiveOutputNotificationDevice,
  setOutputSelectionSupported,
} = audioOutputPreferencesSlice.actions;

export default audioOutputPreferencesSlice;
