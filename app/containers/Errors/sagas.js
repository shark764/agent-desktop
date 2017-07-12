/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, put, call } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';

import { setCRMUnavailable } from 'containers/InfoTab/actions';
import { loginError, serviceError } from 'containers/Login/actions';
import {
  removeInvalidExtension,
  removeInteractionHard,
} from 'containers/AgentDesktop/actions';
import { HANDLE_SDK_ERROR, SET_LOGIN_ERROR_AND_RELOAD } from './constants';
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

export function* goSetLoginErrorAndReload(action) {
  window.onbeforeunload = null; // clear error clearer set in Login
  window.localStorage.setItem('ADError', action.errorType); // Consume in Login component
  try {
    yield call(
      sdkCallToPromise,
      CxEngage.authentication.logout,
      undefined,
      'Errors'
    );
    // Set logout on session-started incase session hadn't yet started
    yield call(
      sdkCallToPromise,
      CxEngage.subscribe,
      'cxengage/session/started',
      'Errors'
    );
    yield call(
      sdkCallToPromise,
      CxEngage.authentication.logout,
      undefined,
      'Errors'
    );
  } catch (error) {
    window.location.reload();
  }
}

export function* handleSDKError() {
  yield takeEvery(HANDLE_SDK_ERROR, goHandleSDKError);
}

export function* setLoginErrorAndReload() {
  yield takeEvery(SET_LOGIN_ERROR_AND_RELOAD, goSetLoginErrorAndReload);
}

// All sagas to be loaded
export default [handleSDKError, setLoginErrorAndReload];
