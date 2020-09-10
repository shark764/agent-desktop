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

export const getActiveOutputRingtoneDevices = (state) =>
  selectAudioOutputPreferences(state).activeOutputRingtoneDevices;

export const selectActiveOutputRingtoneDevices = createSelector(
  [getAvailableOutputDevices, getActiveOutputRingtoneDevices],
  (availables, ringtones) =>
    availables.map((device) => ({
      ...device,
      isActive: ringtones.includes(device.id),
    }))
);

/**
 * Active connected speaker devices
 * Returns array of ids
 */

export const getActiveOutputSpeakerDevices = (state) =>
  selectAudioOutputPreferences(state).activeOutputSpeakerDevices;

export const selectActiveOutputSpeakerDevices = createSelector(
  [getAvailableOutputDevices, getActiveOutputSpeakerDevices],
  (availables, speakers) =>
    availables.map((device) => ({
      ...device,
      isActive: speakers.includes(device.id),
    }))
);

/**
 * Active connected notification devices
 * Returns array of ids
 */

export const getActiveOutputNotificationDevices = (state) =>
  selectAudioOutputPreferences(state).activeOutputNotificationDevices;

export const selectActiveOutputNotificationDevices = createSelector(
  [getAvailableOutputDevices, getActiveOutputNotificationDevices],
  (availables, notifications) =>
    availables.map((device) => ({
      ...device,
      isActive: notifications.includes(device.id),
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
    activeExtension.provider === 'twilio' && activeExtension.type === 'webrtc'
);
