/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentNotificationsMenu thunks
 *
 */

import { selectTenant, selectAgent } from 'containers/Login/selectors';
import { setNonCriticalError } from 'containers/Errors/actions';

import { selectAudioPreferences, selectVisualPreferences } from './selectors';
import {
  setAudioNotificationsPreference,
  setVisualNotificationsPreference,
} from './reducer';

export function initializeNotificatonPreferences() {
  return (dispatch, getState) => {
    const tenant = selectTenant(getState());
    const agent = selectAgent(getState());
    const audioNotifications = localStorage.getItem(
      `skylightAudioNotifications-${tenant.id}-${agent.userId}`
    );
    if (audioNotifications !== null) {
      dispatch(setAudioNotificationsPreference(audioNotifications === 'true'));
    }
    const visualNotifications = localStorage.getItem(
      `skylightVisualNotifications-${tenant.id}-${agent.userId}`
    );
    if (visualNotifications !== null) {
      dispatch(
        setVisualNotificationsPreference(visualNotifications === 'true')
      );
    }
  };
}

export function toggleAudioNotificationsPreference() {
  return (dispatch, getState) => {
    const audioNotifications = selectAudioPreferences(getState());
    dispatch(setAudioNotificationsPreference(!audioNotifications));
    const tenant = selectTenant(getState());
    const agent = selectAgent(getState());
    localStorage.setItem(
      `skylightAudioNotifications-${tenant.id}-${agent.userId}`,
      !audioNotifications
    );
  };
}

export function toggleVisualNotificationsPreference() {
  return (dispatch, getState) => {
    const tenant = selectTenant(getState());
    const agent = selectAgent(getState());
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          dispatch(setVisualNotificationsPreference(true));
          localStorage.setItem(
            `skylightVisualNotifications-${tenant.id}-${agent.userId}`,
            true
          );
        } else {
          dispatch(setNonCriticalError({ code: 'AD-1006' }));
        }
      });
    } else {
      const visualNotifications = selectVisualPreferences(getState());
      dispatch(setVisualNotificationsPreference(!visualNotifications));
      localStorage.setItem(
        `skylightVisualNotifications-${tenant.id}-${agent.userId}`,
        !visualNotifications
      );
    }
  };
}
