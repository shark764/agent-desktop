/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, takeLatest, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import copyToClipboard from 'utils/copyToClipboard';
import Message from 'models/Message/Message';
import {
  setInteractionStatus,
  initializeOutboundSmsForAgentDesktop,
  addMessage,
  setContactMode,
  toggleTranscriptCopied,
} from 'containers/AgentDesktop/actions';
import { addContactNotification } from 'containers/ContactsControl/actions';
import { selectAgent } from 'containers/Login/selectors';
import { getSelectedInteractionId } from 'containers/AgentDesktop/selectors';
import {
  INITIALIZE_OUTBOUND_SMS_FROM_MESSAGING,
  SEND_OUTBOUND_SMS,
  COPY_CHAT_TRANSCRIPT,
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

export function* copyChatTranscript(action) {
  let customer;
  if (
    action.interaction.contact &&
    action.interaction.contact.id !== undefined
  ) {
    customer = action.interaction.contact.attributes.name;
  } else {
    customer =
      action.interaction.channelType === 'sms'
        ? action.interaction.customer
        : action.interaction.messageHistory.find(
          (message) =>
            message.type === 'customer' || message.type === 'message'
        ).from;
  }
  const agent = yield select(selectAgent);
  const agentName = agent.firstName.concat(' ', agent.lastName);
  const chatTranscript = action.interaction.messageHistory.reduce(
    (transcript, { type, from, timestamp, text }) => {
      const date = new Date(timestamp);
      let fromText;
      if (from === agent.userId) {
        fromText = agentName;
      } else if (type === 'system') {
        fromText = 'System';
      } else if (type === 'customer' || type === 'message') {
        fromText = customer;
      } else if (type === 'agent') {
        fromText = from;
      } else {
        console.error(
          'Unexpected message "from" during copy',
          action.interaction.messageHistory
        );
        fromText = '';
      }
      return `${transcript}${date.toLocaleTimeString()} - ${fromText}:
${text}\n\n`;
    },
    `Customer: ${customer}
Agent: ${agentName}
Channel: ${action.interaction.channelType}
Date: ${new Date().toLocaleString()}

---------------------- Chat Transcript ----------------------

`
  );
  copyToClipboard(chatTranscript);
  const interactionId = yield select(getSelectedInteractionId);
  yield put(toggleTranscriptCopied(interactionId, true));
  yield call(delay, 5000);
  yield put(toggleTranscriptCopied(interactionId, false));
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

export function* watchCopyChatTranscript() {
  yield takeLatest(COPY_CHAT_TRANSCRIPT, copyChatTranscript);
}

// All sagas to be loaded
export default [
  watchInitializeOutboundSms,
  watchSendOutboundSms,
  watchCopyChatTranscript,
];
