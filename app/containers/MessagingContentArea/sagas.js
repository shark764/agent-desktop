/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, call, put } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import Message from 'models/Message/Message';
import {
  setInteractionStatus,
  initializeOutboundSmsForAgentDesktop,
  addMessage,
  setContactMode,
} from 'containers/AgentDesktop/actions';
import { addContactNotification } from 'containers/ContactsControl/actions';

import {
  INITIALIZE_OUTBOUND_SMS_FROM_MESSAGING,
  SEND_OUTBOUND_SMS,
} from './constants';

export function* initializeOutboundSmsForMessagingSaga(action) {
  try {
    yield put(
      setInteractionStatus(action.interactionId, 'initializing-outbound')
    );
    const response = yield call(
      sdkCallToPromise,
      CxEngage.interactions.messaging.initializeOutboundSms,
      {
        phoneNumber: action.phoneNumber,
        message: action.message,
      },
      'MessagingContentArea'
    );
    yield put(
      initializeOutboundSmsForAgentDesktop(
        action.interactionId,
        response.interactionId,
        action.message
      )
    );
    // if the SMS was sent to a user in our contacts
    // pull up that user's contact data in the side panel
    if (action.contactId) {
      yield call(
        sdkCallToPromise,
        CxEngage.interactions.assignContact,
        {
          interactionId: response.interactionId,
          contactId: action.contactId,
        },
        'MessagingContentArea'
      );

      yield put(setContactMode(response.interactionId, 'view'));
      yield put(addContactNotification({ messageType: 'assigned' }));
    }
  } catch (error) {
    console.error(error); // TODO
  }
}

export function* sendOutboundSms(action) {
  try {
    yield call(
      sdkCallToPromise,
      CxEngage.interactions.messaging.sendOutboundSms,
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
      timestamp: new Date(Date.now()).toISOString(),
    });
    yield put(addMessage(action.interactionId, message));
  } catch (error) {
    console.error(error); // TODO
  }
}

// Individual exports for testing
export function* watchInitializeOutboundSms() {
  yield takeEvery(
    INITIALIZE_OUTBOUND_SMS_FROM_MESSAGING,
    initializeOutboundSmsForMessagingSaga
  );
}

export function* watchSendOutboundSms() {
  yield takeEvery(SEND_OUTBOUND_SMS, sendOutboundSms);
}

// All sagas to be loaded
export default [watchInitializeOutboundSms, watchSendOutboundSms];
