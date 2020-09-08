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
  activeOutputRingtoneDevices: ['default'],
  activeOutputSpeakerDevices: ['default'],
  activeOutputNotificationDevices: ['default'],
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
      const devices = [];
      action.payload.forEach((device) => {
        devices.push({
          id: device.deviceId,
          label: device.label,
        });
      });

      state.availableOutputDevices = devices;
    },

    setActiveOutputRingtoneDevices(state, action) {
      state.activeOutputRingtoneDevices = getActiveDeviceIds(action.payload);
    },

    setActiveOutputSpeakerDevices(state, action) {
      state.activeOutputSpeakerDevices = getActiveDeviceIds(action.payload);
    },

    setActiveOutputNotificationDevices(state, action) {
      state.activeOutputNotificationDevices = action.payload;
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
  setActiveOutputRingtoneDevices,
  setActiveOutputSpeakerDevices,
  setActiveOutputNotificationDevices,
  setOutputSelectionSupported,
} = audioOutputPreferencesSlice.actions;

export default audioOutputPreferencesSlice;

/**
 * Extracts id property from Sets<> or Arrays[]
 * of devices
 */
const getActiveDeviceIds = (devices) => {
  const deviceIds = [];
  devices.forEach((device) => {
    deviceIds.push(device.deviceId);
  });
  return deviceIds;
};
