import { takeEvery, call, put } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import { updateContactHistoryInteractionDetails } from 'containers/AgentDesktop/actions';
import { LOAD_HISTORICAL_INTERACTION_BODY } from 'containers/AgentDesktop/constants';

export function* loadHistoricalInteractionBody(action) {
  const body = {};
  let recordings;
  try {
    switch (action.bodyType) {
      case 'recordings':
        recordings = yield call(sdkCallToPromise, SDK.interactions.voice.getRecordings, { interactionId: action.interactionId }, 'AgentDesktop');
        body.audioRecordings = recordings.map((recording) => recording.url);
        break;
      case 'transcript':
        body.transcript = yield call(sdkCallToPromise, SDK.interactions.voice.getTranscript, { interactionId: action.interactionId }, 'AgentDesktop');
        break;
      default:
        break;
    }
    yield put(updateContactHistoryInteractionDetails(action.interactionId, body));
  } catch (error) {
    console.error(error); // TODO fire error action?
  }
}

// Individual exports for testing
export function* historicalInteractionBody() {
  yield takeEvery(LOAD_HISTORICAL_INTERACTION_BODY, loadHistoricalInteractionBody);
}

// All sagas to be loaded
export default [
  historicalInteractionBody,
];
