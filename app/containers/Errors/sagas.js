import Raven from 'raven-js';

import { takeEvery, put } from 'redux-saga/effects';
import { HANDLE_SDK_ERROR } from './constants';
import { setCriticalError } from './actions';

export const fatalTopics = [
  'cxengage/session/heartbeat-response',
];

export function* goHandleSDKError(action) {
  try {
    const isFatal = (
      (action.error && action.error.level === 'fatal')
      || fatalTopics.includes(action.topic)
    );
    console.warn('SDK Error:', action.topic, action.error);
    Raven.captureException(new Error(action.topic), {
      level: isFatal ? 'fatal' : 'warning',
      extra: {
        sdkError: action.error,
      },
      tags: {
        sdkCode: action.error && action.error.code,
      },
    });
    if (isFatal) {
      yield put(setCriticalError());
    }
  } catch (error) {
    throw error;
  }
}

export function* handleSDKError() {
  yield takeEvery(HANDLE_SDK_ERROR, goHandleSDKError);
}

// All sagas to be loaded
export default [
  handleSDKError,
];
