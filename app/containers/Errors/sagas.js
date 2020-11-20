/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Raven from 'raven-js';
import { takeEvery, put, select } from 'redux-saga/effects';
import { store } from 'store';

import { setCRMUnavailable } from 'containers/InfoTab/actions';
import {
  removeInvalidExtension,
  removeInteractionHard,
  setInteractionStatus,
  selectInteraction,
  toggleInteractionIsEnding,
  toggleIsRecording,
  updateWrapupDetails,
  toggleInteractionIsMuting,
  toggleInteractionIsHolding,
  toggleInteractionNotification,
  removeSmoochPendingMessage,
} from 'containers/AgentDesktop/actions';
import { selectInteractionsList } from 'containers/AgentDesktop/selectors';
import {
  selectPendingActiveVoiceInteraction,
  selectPendingActiveSmsInteraction,
} from 'containers/InteractionsBar/selectors';
import { selectAgent } from 'containers/Login/selectors';
import { batchRequetsFailing } from 'containers/Toolbar/actions';
import { generateUUID } from 'serenova-js-utils/uuid';
import { HANDLE_SDK_ERROR } from './constants';
import { setCriticalError, setNonCriticalError } from './actions';

export function* goHandleSDKError(action) {
  const { topic } = action;
  const { error } = action;
  let forceFatalInteraction;
  console.warn('SDK Error:', topic, error);
  if (topic === 'cxengage/logging/logs-saved') {
    Raven.captureMessage(
      "Couldn't log error to Kibanna. Logging it to Sentry.",
      {
        tags: {
          type: 'Kibana',
        },
        extra: {
          kibanaLogs: error.data.logs,
        },
        logError: !store.getState().hasIn(['errors', 'criticalError']),
      }
    );
    return;
  } else if (
    error.level === 'interaction-fatal' &&
    error.data &&
    error.data.interactionId
  ) {
    const interactionsList = yield select(selectInteractionsList);
    const erroredInteraction = interactionsList
      .toJS()
      .find(
        (interaction) => interaction.interactionId === error.data.interactionId
      );
    if (!erroredInteraction) {
      // If we do not have the interaction that errored, ignore
      console.warn(
        'Received interaction-fatal, but interation does not exist. Ignoring.'
      );
      return;
    }
    if (
      topic !== 'cxengage/interactions/voice/force-killed-twilio-connection' &&
      erroredInteraction &&
      erroredInteraction.channelType === 'voice' &&
      erroredInteraction.interactionId === error.data.interactionId
    ) {
      yield put(
        setInteractionStatus(erroredInteraction.interactionId, 'fatal')
      );
      yield put(selectInteraction(undefined));
      yield put(setNonCriticalError(error, true));
      return;
    }
  } else if (
    error.code === 2000 || // Not enough tenant permissions. Handled in Login.
    error.code === 12005 || // Failed to get capacity. Handled in TransferMenu.
    topic === 'cxengage/contacts/create-contact-response' || // Handled in ContactEdit
    topic === 'cxengage/contacts/update-contact-response' || // Handled in ContactEdit
    topic === 'cxengage/contacts/merge-contacts-response' || // Handled in ContactMerge
    topic === 'cxengage/interactions/unfocus-acknowledged' || // Not needed to be shown to agent
    topic === 'cxengage/interactions/focus-acknowledged' || // Not needed to be shown to agent
    topic === 'cxengage/reporting/get-bulk-stat-query-response' || // Not needed to be shown to agent
    topic ===
      'cxengage/interactions/smooch-messaging/conversation-read-agent-received' || // Not needed to be shown to agent
    topic === 'cxengage/interactions/smooch-messaging/typing-agent-received' // Not needed to be shown to agent
  ) {
    return; // Do nothing. Error UI handled in their own components.
  } else if (error.code === 4002 && error.data.flowMessage) {
    const interactionsList = yield select(selectInteractionsList);
    const erroredInteraction = interactionsList.find(
      (interaction) => interaction.interactionId === error.data.interactionId
    );
    if (!erroredInteraction) {
      // If we do not have the interaction that errored, ignore
      console.warn(
        'Received interaction-fatal, but interation does not exist. Ignoring.'
      );
      return;
    }
    return;
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
    forceFatalInteraction = yield select(selectPendingActiveVoiceInteraction);
  } else if (
    topic === 'cxengage/interactions/messaging/initialize-outbound-sms-response'
  ) {
    forceFatalInteraction = yield select(selectPendingActiveSmsInteraction);
  } else if (
    topic ===
    'cxengage/errors/error/failed-to-create-outbound-email-interaction'
  ) {
    forceFatalInteraction = true;
  } else if (topic === 'cxengage/reporting/batch-response') {
    yield put(batchRequetsFailing(false));
    return;
  } else if (
    topic === 'cxengage/interactions/end-acknowledged' ||
    topic === 'cxengage/interactions/work-ended-received'
  ) {
    yield put(toggleInteractionIsEnding(error.data.interactionId, false));
  } else if (
    topic === 'cxengage/interactions/voice/start-recording-acknowledged' ||
    topic === 'cxengage/interactions/voice/stop-recording-acknowledged' ||
    topic === 'cxengage/interactions/voice/recording-start-received' ||
    topic === 'cxengage/interactions/voice/recording-end-received'
  ) {
    yield put(toggleIsRecording(error.data.interactionId, false));
  } else if (
    topic === 'cxengage/interactions/enable-wrapup-acknowledged' ||
    topic === 'cxengage/interactions/disable-wrapup-acknowledged'
  ) {
    yield put(
      updateWrapupDetails(error.data.interactionId, {
        loadingWrapupStatusUpdate: false,
      })
    );
  } else if (
    topic === 'cxengage/interactions/voice/mute-acknowledged' ||
    topic === 'cxengage/interactions/voice/unmute-acknowledged'
  ) {
    yield put(toggleInteractionIsMuting(error.data.interactionId, false));
  } else if (
    topic === 'cxengage/interactions/voice/resource-mute-received' ||
    topic === 'cxengage/interactions/voice/resource-unmute-received '
  ) {
    const agent = yield select(selectAgent);
    if (agent.userId === error.data.resourceId) {
      yield put(toggleInteractionIsMuting(error.data.interactionId, false));
    }
  } else if (
    topic === 'cxengage/interactions/voice/resume-acknowledged' ||
    topic === 'cxengage/interactions/voice/hold-acknowledged' ||
    topic === 'cxengage/interactions/voice/customer-hold-received' ||
    topic === 'cxengage/interactions/voice/customer-resume-received' ||
    topic === 'cxengage/interactions/voice/customer-hold-error' ||
    topic === 'cxengage/interactions/voice/customer-resume-error'
  ) {
    yield put(toggleInteractionIsHolding(error.data.interactionId, false));
  } else if (
    error.code === 3000 &&
    action.error.data.apiResponse.status === 401
  ) {
    // Custom error for invalid user credentials
    error.code = 'AD-1002';
  }

  // Fallback Error Handling if not dealt with above

  // Fatal Interaction Removal
  if (error.level === 'interaction-fatal') {
    yield put(removeInteractionHard(error.data.interactionId));
  } else if (forceFatalInteraction) {
    yield put(removeInteractionHard(forceFatalInteraction.interactionId));
  }

  if (
    (error.code === 6007 || error.code === 6010 || error.code === 4003) &&
    (topic === 'cxengage/interactions/smooch-messaging/message-received' ||
      topic === 'cxengage/interactions/smooch-messaging/attachment-sent')
  ) {
    if (error.code === 4003) {
      yield put(removeInteractionHard(error.data.interactionId));
    } else {
      yield put(
        removeSmoochPendingMessage(
          error.data.interactionId,
          error.data.agentMessageId
        )
      );
    }
  }

  // Error Banner Notifications
  if (error.level === 'interaction-fatal' || forceFatalInteraction) {
    yield put(setNonCriticalError(error, true));
  } else if (error.level === 'session-fatal') {
    yield put(setCriticalError(error));
  } else if (error.level === 'error') {
    yield put(setNonCriticalError(error));
  } else if (error.level === 'interaction-error') {
    yield put(
      toggleInteractionNotification(error.data.interactionId, {
        ...error,
        uuid: generateUUID(),
        // Useful for when we don't want to be able to dismiss and error, an "critical-interaction-error"
        // so to speak, but for the time being we don't know which errors could qualify for that.
        isDismissible: true,
        isError: true,
      })
    );
  }
}

export function* handleSDKError() {
  yield takeEvery(HANDLE_SDK_ERROR, goHandleSDKError);
}

// All sagas to be loaded
export default [handleSDKError];
