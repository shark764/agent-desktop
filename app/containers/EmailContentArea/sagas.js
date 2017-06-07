import { takeEvery, call, put } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import { setInteractionStatus, startOutboundInteraction } from 'containers/AgentDesktop/actions';
import { START_OUTBOUND_EMAIL } from './constants';

export function* startOutboundEmailSaga(action) {
  try {
    const response = yield call(
      sdkCallToPromise,
      CxEngage.interactions.email.startOutboundEmail,
      {
        address: action.customer,
      },
      'EmailContentArea'
    );
    yield put(startOutboundInteraction('email', action.customer, action.contact, false, response.interactionId));
    yield put(setInteractionStatus(response.interactionId, 'initialized-outbound'));
  } catch (e) {
    // Handled in Errors Sagas
  }
}

// Individual exports for testing
export function* watchStartOutboundEmail() {
  yield takeEvery(START_OUTBOUND_EMAIL, startOutboundEmailSaga);
}

// All sagas to be loaded
export default [
  watchStartOutboundEmail,
];
