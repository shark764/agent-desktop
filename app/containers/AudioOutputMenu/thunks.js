/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AudioOutputMenu thunks
 *
 */

import {
  getActiveOutputRingtoneDevices,
  getActiveOutputSpeakerDevices,
  getActiveOutputNotificationDevices,
  getAvailableOutputDevices,
} from './selectors';

import { setActiveOutputNotificationDevices } from './reducer';

/**
 * More than one device can be set as active
 * therefore we get active devices first and
 * concatenate new one
 * If id is already in array, then we remove it
 *
 * We do the same for every kind of audiooutput type
 */

export function updateActiveOutputRingtoneDevice(deviceId) {
  return (dispatch, getState) => {
    let activeDevices = getActiveOutputRingtoneDevices(getState());
    if (activeDevices.includes(deviceId)) {
      activeDevices = activeDevices.filter((device) => device !== deviceId);
    } else {
      activeDevices = [...activeDevices, deviceId];
    }
    CxEngage.twilio.setActiveOutputRingtoneDevices({
      deviceIds: activeDevices,
    });
  };
}

export function updateActiveOutputSpeakerDevice(deviceId) {
  return (dispatch, getState) => {
    let activeDevices = getActiveOutputSpeakerDevices(getState());
    if (activeDevices.includes(deviceId)) {
      activeDevices = activeDevices.filter((device) => device !== deviceId);
    } else {
      activeDevices = [...activeDevices, deviceId];
    }

    CxEngage.twilio.setActiveOutputSpeakerDevices({
      deviceIds: activeDevices,
    });
  };
}

export function updateActiveOutputNotificationDevice(deviceId) {
  return (dispatch, getState) => {
    let activeDevices = getActiveOutputNotificationDevices(getState());
    if (activeDevices.includes(deviceId)) {
      activeDevices = activeDevices.filter((device) => device !== deviceId);
    } else {
      activeDevices = [...activeDevices, deviceId];
    }

    dispatch(setActiveOutputNotificationDevices(activeDevices));
  };
}

/**
 * Helps to keep notification devices up
 * with available devices
 * When a device is plugged/unplugged, we need
 * to remove it from notification list
 */
export function updateActiveOutputNotificationDevices() {
  return (dispatch, getState) => {
    const availables = getAvailableOutputDevices(getState());
    const notifications = getActiveOutputNotificationDevices(getState());
    const activeDevices = availables
      .map((device) => device.id)
      .filter((id) => notifications.includes(id));

    dispatch(setActiveOutputNotificationDevices(activeDevices));
  };
}
