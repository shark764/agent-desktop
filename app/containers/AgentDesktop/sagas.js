import { takeEvery, call, put } from 'redux-saga/effects';
import axios from 'axios';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import { updateContactHistoryInteractionDetails, setContactInteractionHistory } from 'containers/AgentDesktop/actions';
import { LOAD_HISTORICAL_INTERACTION_BODY, LOAD_CONTACT_INTERACTION_HISTORY } from 'containers/AgentDesktop/constants';

export function* loadHistoricalInteractionBody(action) {
  const body = {};
  let metaData;
  let transcriptResponse;
  try {
    switch (action.bodyType) {
      case 'recordings':
        metaData = yield call(
          sdkCallToPromise,
          SDK.interactions.voice.getRecordings,
          { interactionId: action.interactionId },
          'AgentDesktop'
        );
        body.audioRecordings = metaData.map((recording) => recording.url);
        break;
      case 'transcript':
        metaData = yield call(
          sdkCallToPromise,
          SDK.interactions.messaging.getTranscripts,
          { interactionId: action.interactionId },
          'AgentDesktop'
        );
        transcriptResponse = yield call(axios.get, metaData[0] && metaData[0].url);
        body.transcript = transcriptResponse && transcriptResponse.data
          ? transcriptResponse.data
          : [];
        break;
      default:
        break;
    }
    if (Object.keys(body).length) {
      yield put(updateContactHistoryInteractionDetails(action.interactionId, body));
    }
  } catch (error) {
    console.error(error); // TODO fire error action?
  }
}

export function* loadContactInteractions(action) {
  let contactInteractionHistoryDetails;
  const contactQuery = { entityId: action.contactId };
  if (typeof action.page !== 'undefined') {
    contactQuery.page = action.page;
  }
  try {
    contactInteractionHistoryDetails = yield call(
      sdkCallToPromise,
      SDK.reporting.getContactHistory,
      contactQuery,
      'AgentDesktop'
    );
  } catch (error) {
    console.error(error);
  }
  yield put(setContactInteractionHistory(action.contactId, contactInteractionHistoryDetails));
}

// Individual exports for testing
export function* historicalInteractionBody() {
  yield takeEvery(LOAD_HISTORICAL_INTERACTION_BODY, loadHistoricalInteractionBody);
}

export function* contactInteractionHistory() {
  yield takeEvery(LOAD_CONTACT_INTERACTION_HISTORY, loadContactInteractions);
}

// All sagas to be loaded
export default [
  historicalInteractionBody,
  contactInteractionHistory,
];
