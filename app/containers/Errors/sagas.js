/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Raven from 'raven-js';

import { takeEvery, put, call } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';

import { setCRMUnavailable } from 'containers/InfoTab/actions';
import { removeInvalidExtension } from 'containers/AgentDesktop/actions';
import { HANDLE_SDK_ERROR, SET_LOGIN_ERROR_AND_RELOAD } from './constants';
import { setCriticalError, setNonCriticalError, setLoginErrorAndReload as setLoginErrorAndReloadAction } from './actions';
import errorMessagesMap from './errorMessagesMap';


export const topicActions = {
  'cxengage/contacts/list-layouts-response': setCRMUnavailable('crmLayoutError'),
  'cxengage/contacts/list-attributes-response': setCRMUnavailable('crmAttributeError'),
  'cxengage/session/config-details': setLoginErrorAndReloadAction('configLoadFailed'),
};

export const sentryIgnoreTopics = [
  'cxengage/session/heartbeat-response',
];

export function* goHandleSDKError(action) {
  const topic = action.topic;
  const error = action.error;
  switch (topic) {
    case 'cxengage/errors/error/api-rejected-bad-client-request': // Ignoring until removed by SDK
    case 'cxengage/authentication/login-response': // Handled in Login container
      break;
    case 'cxengage/session/state-change-request-acknowledged':
      if (error.code === 2005) {
        yield put(removeInvalidExtension());
      }
      if (errorMessagesMap[error.code] === undefined) {
        Raven.captureException(new Error('Unknown error code returned from SDK.'), {
          level: 'warning',
          extra: {
            sdkError: error,
          },
          tags: {
            sdkCode: error.code,
          },
        });
      } else {
        yield put(setNonCriticalError(topic, error));
      }
      break;
    case 'cxengage/session/heartbeat-response':
      yield put(setCriticalError(topic, error));
      break;
    case 'cxengage/interactions/email/start-outbound-email':
    case 'cxengage/errors/error/failed-to-create-outbound-email-interaction':
    case 'cxengage/interactions/email/send-reply':
      yield put(setNonCriticalError(topic, error));
      break;
    default: {
      const isFatal = (error && error.level === 'fatal');
      console.warn('SDK Error:', topic, error);
      if (Raven.isSetup() && !sentryIgnoreTopics.includes(topic)) {
        Raven.captureException(new Error(topic), {
          level: isFatal ? 'fatal' : 'warning',
          extra: {
            sdkError: error,
          },
          tags: {
            sdkCode: error && error.code,
          },
        });
      }
      if (isFatal) {
        yield put(setCriticalError(topic, error));
      } else if (topicActions[topic]) {
        yield put(topicActions[topic]);
      }
    }
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
export default [
  handleSDKError,
  setLoginErrorAndReload,
];
