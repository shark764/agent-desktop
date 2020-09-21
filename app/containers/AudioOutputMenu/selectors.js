/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import { createSelector } from '@reduxjs/toolkit';

import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';

const selectAudioOutputPreferences = (state) =>
  state.get('audioOutputPreferences');

/**
 * Available connected devices
 * Returns array containing:
 * {
 *    id: "default"
 *    label: "Default"
 * }
 */
export const getAvailableOutputDevices = (state) =>
  selectAudioOutputPreferences(state).availableOutputDevices;

/**
 * Active connected ringtone devices
 * Returns array of ids
 */
export const getActiveOutputRingtoneDevice = (state) =>
  selectAudioOutputPreferences(state).activeOutputRingtoneDevice;

export const selectActiveOutputRingtoneDevices = createSelector(
  [getAvailableOutputDevices, getActiveOutputRingtoneDevice],
  (availables, ringtone) =>
    availables.map((device) => ({
      ...device,
      isActive: ringtone === device.id,
    }))
);

/**
 * Active connected speaker devices
 * Returns array of ids
 */
export const getActiveOutputSpeakerDevice = (state) =>
  selectAudioOutputPreferences(state).activeOutputSpeakerDevice;

export const selectActiveOutputSpeakerDevices = createSelector(
  [getAvailableOutputDevices, getActiveOutputSpeakerDevice],
  (availables, speaker) =>
    availables.map((device) => ({
      ...device,
      isActive: speaker === device.id,
    }))
);

/**
 * Active connected notification devices
 * Returns array of ids
 */
export const getActiveOutputNotificationDevice = (state) =>
  selectAudioOutputPreferences(state).activeOutputNotificationDevice;

export const selectActiveOutputNotificationDevices = createSelector(
  [getAvailableOutputDevices, getActiveOutputNotificationDevice],
  (availables, notification) =>
    availables.map((device) => ({
      ...device,
      isActive: notification === device.id,
    }))
);

/**
 * Returns if choosing devices is supported by browser
 */
export const selectOutputSelectionSupported = (state) =>
  selectAudioOutputPreferences(state).isOutputSelectionSupported;

/**
 * Returns if active extension is Twilio/WebRTC
 */
export const selectActiveExtensionIsTwilio = createSelector(
  selectActiveExtension,
  (activeExtension) =>
    activeExtension &&
    activeExtension.provider === 'twilio' &&
    activeExtension.type === 'webrtc'
);
