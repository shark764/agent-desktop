/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, put, select } from 'redux-saga/effects';

import { setCRMUnavailable } from 'containers/InfoTab/actions';
import { loginError, serviceError } from 'containers/Login/actions';
import {
  removeInvalidExtension,
  removeInteractionHard,
} from 'containers/AgentDesktop/actions';
import { selectPendingActiveVoiceInteraction } from 'containers/InteractionsBar/selectors';
import { HANDLE_SDK_ERROR } from './constants';
import { setCriticalError, setNonCriticalError } from './actions';

export function* goHandleSDKError(action) {
  const topic = action.topic;
  const error = action.error;
  console.warn('SDK Error:', topic, error);
  if (error.code === 14000) {
    // Error with logging
    // TODO analytics
    return;
  } else if (
    error.code === 2000 || // Not enough tenant permissions. Handled in Login.
    error.code === 12005 || // Failed to get capacity. Handled in TransferMenu.
    topic === 'cxengage/contacts/create-contact-response' || // Handled in ContactEdit
    topic === 'cxengage/contacts/update-contact-response' || // Handled in ContactEdit
    topic === 'cxengage/contacts/merge-contacts-response' // Handled in ContactMerge
  ) {
    return; // Do nothing. Error UI handled in their own components.
  } else if (error.code === 2005) {
    // Invalid extension provided
    yield put(removeInvalidExtension());
  } else if (topic === 'cxengage/contacts/list-layouts-response') {
    yield put(setCRMUnavailable('crmLayoutError'));
    return;
  } else if (topic === 'cxengage/contacts/list-attributes-response') {
    yield put(setCRMUnavailable('crmAttributeError'));
    return;
  } else if (topic === 'cxengage/interactions/voice/dial-send-acknowledged') {
    const currentFailedVoiceInteraction = yield select(
      selectPendingActiveVoiceInteraction
    );
    yield put(
      removeInteractionHard(currentFailedVoiceInteraction.interactionId)
    );
  } else if (error.code === 3000) {
    if (action.error.data.apiResponse.status === 401) {
      yield put(loginError());
      return;
    } else {
      yield put(serviceError());
    }
    return;
  }

  if (error.level === 'session-fatal') {
    yield put(setCriticalError(topic, error));
  } else if (error.level === 'error') {
    yield put(setNonCriticalError(topic, error));
  } else if (error.level === 'interaction-fatal') {
    yield put(removeInteractionHard(error.data.interactionId));
  }
}

export function* handleSDKError() {
  yield takeEvery(HANDLE_SDK_ERROR, goHandleSDKError);
}

// All sagas to be loaded
export default [handleSDKError];
