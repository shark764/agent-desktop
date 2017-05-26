import Raven from 'raven-js';

import { takeEvery, put } from 'redux-saga/effects';
import { setCRMUnavailable } from 'containers/InfoTab/actions';
import { HANDLE_SDK_ERROR } from './constants';
import { setCriticalError } from './actions';

export const topicActions = {
  'cxengage/contacts/list-layouts-response': setCRMUnavailable('crmLayoutError'),
  'cxengage/contacts/list-attributes-response': setCRMUnavailable('crmAttributeError'),
};

export function* goHandleSDKError(action) {
  const topic = action.topic;
  const error = action.error;
  switch (topic) {
    case 'cxengage/errors/error/api-rejected-bad-client-request': // Ignoring until removed by SDK
    case 'cxengage/authentication/login-response': // Handled in Login container
      break;
    case 'cxengage/session/heartbeat-response':
      window.onbeforeunload = null; // clear error clearer set in Login
      window.localStorage.setItem('ADError', topic); // Consume in Login component
      location.reload(); // Kill it with 🔥
      break;
    default: {
      const isFatal = (error && error.level === 'fatal');
      console.warn('SDK Error:', topic, error);
      Raven.captureException(new Error(topic), {
        level: isFatal ? 'fatal' : 'warning',
        extra: {
          sdkError: error,
        },
        tags: {
          sdkCode: error && error.code,
        },
      });
      if (isFatal) {
        yield put(setCriticalError());
      } else if (topicActions[topic]) {
        yield put(topicActions[topic]);
      }
    }
  }
}

export function* handleSDKError() {
  yield takeEvery(HANDLE_SDK_ERROR, goHandleSDKError);
}

// All sagas to be loaded
export default [
  handleSDKError,
];
