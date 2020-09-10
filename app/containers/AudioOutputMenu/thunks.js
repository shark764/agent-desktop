/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AudioOutputMenu thunks
 *
 */

import {
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
  return () => {
    CxEngage.twilio.setActiveOutputRingtoneDevices({
      deviceIds: deviceId,
    });
  };
}

export function updateActiveOutputSpeakerDevice(deviceId) {
  return () => {
    CxEngage.twilio.setActiveOutputSpeakerDevices({
      deviceIds: deviceId,
    });
  };
}

export function updateActiveOutputNotificationDevice(deviceId) {
  return (dispatch) => {
    dispatch(setActiveOutputNotificationDevices([deviceId]));
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
