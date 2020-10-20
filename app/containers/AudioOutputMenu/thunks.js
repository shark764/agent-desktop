/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AudioOutputMenu thunks
 *
 */

import { selectTenant, selectAgent } from 'containers/Login/selectors';
import { getActiveOutputNotificationDevice } from './selectors';

import {
  setAvailableOutputDevices,
  setActiveOutputRingtoneDevice,
  setActiveOutputSpeakerDevice,
  setActiveOutputNotificationDevice,
} from './reducer';

export function updateActiveOutputRingtoneDevice(deviceId) {
  return () => {
    CxEngage.twilio.setActiveOutputRingtoneDevices({
      deviceIds: deviceId,
    });
  };
}
export function updateActiveOutputRingtoneDevices(activeOutputRingtoneDevices) {
  return (dispatch, getState) => {
    const ringtoneId = activeOutputRingtoneDevices.values().next().value
      .deviceId;
    dispatch(setActiveOutputRingtoneDevice(ringtoneId));

    const tenant = selectTenant(getState());
    const agent = selectAgent(getState());
    let audioOutputPreferences = localStorage.getItem(
      `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`
    );
    audioOutputPreferences = audioOutputPreferences
      ? JSON.parse(audioOutputPreferences)
      : {};
    audioOutputPreferences.ringtoneId = ringtoneId;
    localStorage.setItem(
      `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`,
      JSON.stringify(audioOutputPreferences)
    );
  };
}

export function updateActiveOutputSpeakerDevice(deviceId) {
  return () => {
    CxEngage.twilio.setActiveOutputSpeakerDevices({
      deviceIds: deviceId,
    });
  };
}
export function updateActiveOutputSpeakerDevices(activeOutputSpeakerDevices) {
  return (dispatch, getState) => {
    const speakerId = activeOutputSpeakerDevices.values().next().value.deviceId;
    dispatch(setActiveOutputSpeakerDevice(speakerId));

    const tenant = selectTenant(getState());
    const agent = selectAgent(getState());
    let audioOutputPreferences = localStorage.getItem(
      `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`
    );
    audioOutputPreferences = audioOutputPreferences
      ? JSON.parse(audioOutputPreferences)
      : {};
    audioOutputPreferences.speakerId = speakerId;
    localStorage.setItem(
      `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`,
      JSON.stringify(audioOutputPreferences)
    );
  };
}

export function updateActiveOutputNotificationDevice(deviceId) {
  return (dispatch, getState) => {
    dispatch(setActiveOutputNotificationDevice(deviceId));

    const tenant = selectTenant(getState());
    const agent = selectAgent(getState());
    let audioOutputPreferences = localStorage.getItem(
      `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`
    );
    audioOutputPreferences = audioOutputPreferences
      ? JSON.parse(audioOutputPreferences)
      : {};
    audioOutputPreferences.notificationId = deviceId;
    localStorage.setItem(
      `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`,
      JSON.stringify(audioOutputPreferences)
    );
  };
}

/**
 * Initializes user preference for current tenant
 * and current user
 */
export function goUpdateAudioOutputUserPreferences(payload) {
  return (dispatch, getState) => {
    /**
     * Saving new devices available
     */
    const availableOutputDevices = [];
    payload.availableOutputDevices.forEach((device) => {
      availableOutputDevices.push({
        id: device.deviceId,
        label: device.label,
      });
    });
    dispatch(setAvailableOutputDevices(availableOutputDevices));

    const tenant = selectTenant(getState());
    const agent = selectAgent(getState());
    /**
     * Getting saved user preferences for this tenant and browser
     */
    const audioOutputPreferences = localStorage.getItem(
      `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`
    );

    /**
     * "deviceChange" Twilio event is called when a device is plugged/unplugged
     * SDK function that handles it returns a Set with
     *  * Available devices
     *  * Active ringtone devices
     *  * Active speaker devices
     */
    if (
      payload.activeOutputRingtoneDevices.size > 0 &&
      payload.activeOutputSpeakerDevices.size > 0
    ) {
      const ringtoneId = payload.activeOutputRingtoneDevices.values().next()
        .value.deviceId;
      dispatch(setActiveOutputRingtoneDevice(ringtoneId));
      const speakerId = payload.activeOutputSpeakerDevices.values().next().value
        .deviceId;
      dispatch(setActiveOutputSpeakerDevice(speakerId));
      /**
       * Helps to keep notification devices up with available devices
       * When a device is plugged/unplugged, we need to remove it from notification list
       */
      const notificationDeviceId = getActiveOutputNotificationDevice(
        getState()
      );
      const activeNotificationDevice = availableOutputDevices.find(
        (device) => device.id === notificationDeviceId
      );
      const notificationId = activeNotificationDevice
        ? activeNotificationDevice.id
        : 'default';
      dispatch(setActiveOutputNotificationDevice(notificationId));

      /**
       * If active ringtone/speaker devices are not empty, then we need
       * to update localStorage with new preferences
       */
      localStorage.setItem(
        `skylightAudioOutputPreferences-${tenant.id}-${agent.userId}`,
        JSON.stringify({
          ringtoneId,
          speakerId,
          notificationId,
        })
      );
    } else if (audioOutputPreferences !== null) {
      /**
       * There are not active devices set, then we get them from preferences saved in
       * localStorage, if exists and is a valid output device
       */
      const { ringtoneId, speakerId, notificationId } = JSON.parse(
        audioOutputPreferences
      );
      if (
        ringtoneId &&
        availableOutputDevices.find(
          (outputDevice) => outputDevice.id === ringtoneId
        )
      ) {
        dispatch(exports.updateActiveOutputRingtoneDevice(ringtoneId));
      }
      if (
        speakerId &&
        availableOutputDevices.find(
          (outputDevice) => outputDevice.id === speakerId
        )
      ) {
        dispatch(exports.updateActiveOutputSpeakerDevice(speakerId));
      }
      if (
        notificationId &&
        availableOutputDevices.find(
          (outputDevice) => outputDevice.id === notificationId
        )
      ) {
        dispatch(setActiveOutputNotificationDevice(notificationId));
      }
    }
  };
}
