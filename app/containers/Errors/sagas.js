import Raven from 'raven-js';

import { takeEvery, put } from 'redux-saga/effects';
import { setCRMUnavailable } from 'containers/InfoTab/actions';
import { removeInvalidExtension } from 'containers/AgentDesktop/actions';
import { HANDLE_SDK_ERROR } from './constants';
import { setCriticalError, setNonCriticalError } from './actions';
import errorMessagesMap from './errorMessagesMap';


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
        yield put(setNonCriticalError(error));
      }
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
