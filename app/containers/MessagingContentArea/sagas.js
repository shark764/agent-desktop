import { takeEvery, call, put } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import Message from 'models/Message/Message';
import { setInteractionStatus, initializeOutboundSms, addMessage } from 'containers/AgentDesktop/actions';
import { INITIALIZE_OUTBOUND_SMS, SEND_OUTBOUND_SMS } from './constants';

export function* initializeOutboundSmsSaga(action) {
  try {
    yield put(setInteractionStatus(action.interactionId, 'initializing-outbound'));
    const response = yield call(
      sdkCallToPromise,
      SDK.interactions.messaging.initializeOutboundSms,
      {
        phoneNumber: action.phoneNumber,
        message: action.message,
      },
      'MessagingContentArea'
    );
    yield put(initializeOutboundSms(action.interactionId, response.interactionId, action.message));
  } catch (error) {
    console.error(error); // TODO
  }
}

export function* sendOutboundSms(action) {
  try {
    yield call(
      sdkCallToPromise,
      SDK.interactions.messaging.sendOutboundSms,
      {
        interactionId: action.interactionId,
        message: action.message,
      },
      'MessagingContentArea'
    );
    const message = new Message({
      type: 'agent',
      from: 'Agent',
      text: action.message,
      timestamp: (new Date(Date.now())).toISOString(),
      unread: false,
    });
    yield put(addMessage(action.interactionId, message));
  } catch (error) {
    console.error(error); // TODO
  }
}

// Individual exports for testing
export function* watchInitializeOutboundSms() {
  yield takeEvery(INITIALIZE_OUTBOUND_SMS, initializeOutboundSmsSaga);
}

export function* watchSendOutboundSms() {
  yield takeEvery(SEND_OUTBOUND_SMS, sendOutboundSms);
}

// All sagas to be loaded
export default [
  watchInitializeOutboundSms,
  watchSendOutboundSms,
];
