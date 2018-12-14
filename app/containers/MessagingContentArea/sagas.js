/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, takeLatest, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import { copyToClipboard } from 'serenova-js-utils/browser';
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
import { setNonCriticalError } from 'containers/Errors/actions';
import { getSelectedOutboundIdentifier } from 'containers/OutboundAniSelect/selectors';
import {
  INITIALIZE_OUTBOUND_SMS_FROM_MESSAGING,
  SEND_OUTBOUND_SMS,
  COPY_CHAT_TRANSCRIPT,
} from './constants';

export function* initializeOutboundSmsForMessagingSaga(action) {
  if (action.message === 'RIVZGJMXXOYFYMKLOWJLUPICGYEOMOXYWKNBNYITGWVGPPIEBO') {
    throw new Error('test saga');
  }
  try {
    yield put(
      setInteractionStatus(action.interactionId, 'initializing-outbound')
    );
    const selectedOutbondIdentifier = yield select(
      getSelectedOutboundIdentifier
    );
    const smsOutboundInteractionDetails = {
      phoneNumber: action.phoneNumber,
      message: action.message,
      popUri: action.popUri,
    };

    if (
      selectedOutbondIdentifier &&
      selectedOutbondIdentifier.channelType === 'sms'
    ) {
      const { outboundIdentifier, flowId } = selectedOutbondIdentifier;
      smsOutboundInteractionDetails.outboundAni = outboundIdentifier;
      smsOutboundInteractionDetails.flowId = flowId;
    }
    const response = yield call(
      sdkCallToPromise,
      CxEngage.interactions.messaging.initializeOutboundSms,
      smsOutboundInteractionDetails,
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
  const currentAgent = agent.firstName.concat(' ', agent.lastName);
  const agentsName = action.interaction.messageHistory.reduce(
    (names, { type, from }) => {
      if (type === 'agent' && from !== agent.userId && !names.includes(from)) {
        names.push(from);
      }
      return names;
    },
    []
  );
  const chatTranscript = action.interaction.messageHistory.reduce(
    (transcript, { type, from, timestamp, text }) => {
      const date = new Date(timestamp);
      let fromText;
      if (from === agent.userId) {
        fromText = currentAgent;
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
      return `${transcript}${date.toLocaleTimeString()} - ${fromText}: ${text.trim()}
`;
    },
    `Customer: ${customer}
Current Agent: ${currentAgent} ${
  agentsName.length > 0
    ? `\nOther Agent${agentsName.length > 1 ? 's' : ''}: ${agentsName.join(
      ', '
    )}`
    : ''
}
Channel: ${action.interaction.channelType}
Date: ${new Date().toLocaleString()}
---------------------- Chat Transcript ----------------------
`
  );
  if (copyToClipboard(chatTranscript)) {
    yield put(toggleTranscriptCopied(action.interaction.interactionId, true));
    yield call(delay, 5000);
    yield put(toggleTranscriptCopied(action.interaction.interactionId, false));
  } else {
    yield put(setNonCriticalError({ code: 'AD-1007' }));
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

export function* watchCopyChatTranscript() {
  yield takeLatest(COPY_CHAT_TRANSCRIPT, copyChatTranscript);
}

// All sagas to be loaded
export default [
  watchInitializeOutboundSms,
  watchSendOutboundSms,
  watchCopyChatTranscript,
];
