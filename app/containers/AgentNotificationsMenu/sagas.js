import { takeEvery, put, select, call } from 'redux-saga/effects';

import { setNonCriticalError } from 'containers/Errors/actions';
import { selectTenant, selectAgent } from 'containers/Login/selectors';

import * as ACTIONS from './constants';
import { selectAudioPreferences, selectVisualPreferences } from './selectors';
import {
  setAudioNotificationsPreference,
  setVisualNotificationsPreference,
} from './actions';

export function* goInitializeNotificatonPreferences() {
  const tenant = yield select(selectTenant);
  const agent = yield select(selectAgent);
  const audioNotifications = localStorage.getItem(
    `skylightAudioNotifications-${tenant.id}-${agent.id}`
  );
  if (audioNotifications !== null) {
    yield put(setAudioNotificationsPreference(audioNotifications === 'true'));
  }
  const visualNotifications = localStorage.getItem(
    `skylightVisualNotifications-${tenant.id}-${agent.id}`
  );
  if (visualNotifications !== null) {
    yield put(setVisualNotificationsPreference(visualNotifications === 'true'));
  }
}

export function* goToggleAudioNotificationsPreference() {
  const audioNotifications = yield select(selectAudioPreferences);
  yield put(setAudioNotificationsPreference(!audioNotifications));
  const tenant = yield select(selectTenant);
  const agent = yield select(selectAgent);
  localStorage.setItem(
    `skylightAudioNotifications-${tenant.id}-${agent.id}`,
    !audioNotifications
  );
}

export function* goToggleVisualNotificationsPreference() {
  if (Notification.permission !== 'granted') {
    const result = yield call(Notification.requestPermission);
    if (result === 'granted') {
      yield put(setVisualNotificationsPreference(true));
      const tenant = yield select(selectTenant);
      const agent = yield select(selectAgent);
      localStorage.setItem(
        `skylightVisualNotifications-${tenant.id}-${agent.id}`,
        true
      );
    } else {
      yield put(setNonCriticalError({ code: 'AD-1006' }));
    }
  } else {
    const visualNotifications = yield select(selectVisualPreferences);
    yield put(setVisualNotificationsPreference(!visualNotifications));
    const tenant = yield select(selectTenant);
    const agent = yield select(selectAgent);
    localStorage.setItem(
      `skylightVisualNotifications-${tenant.id}-${agent.id}`,
      !visualNotifications
    );
  }
}

export function* initializeNotificatonPreferences() {
  yield takeEvery(
    ACTIONS.INITIALIZE_NOTIFICATION_PREFERENCES,
    goInitializeNotificatonPreferences
  );
}
export function* toggleAudioNotificationsPreference() {
  yield takeEvery(
    ACTIONS.TOGGLE_AUDIO_NOTIFICATIONS_PREFERENCE,
    goToggleAudioNotificationsPreference
  );
}
export function* toggleVisualNotificationsPreference() {
  yield takeEvery(
    ACTIONS.TOGGLE_VISUAL_NOTIFICATIONS_PREFERENCE,
    goToggleVisualNotificationsPreference
  );
}

export default [
  initializeNotificatonPreferences,
  toggleAudioNotificationsPreference,
  toggleVisualNotificationsPreference,
];
