/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, call, put } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import {
  setInteractionStatus,
  startOutboundInteraction,
} from 'containers/AgentDesktop/actions';
import { goAssignContact } from 'containers/AgentDesktop/sagas';
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
    yield put(
      startOutboundInteraction(
        'email',
        action.customer,
        action.contact,
        action.addedByNewInteractionPanel,
        response.interactionId,
        true
      )
    );
    yield put(
      setInteractionStatus(response.interactionId, 'initialized-outbound')
    );

    if (action.contact.id) {
      yield call(goAssignContact, {
        interactionId: response.interactionId,
        contact: action.contact,
        skipUnassign: true,
      });
    }
  } catch (e) {
    // Handled in Errors Sagas
  }
}

// Individual exports for testing
export function* watchStartOutboundEmail() {
  yield takeEvery(START_OUTBOUND_EMAIL, startOutboundEmailSaga);
}

// All sagas to be loaded
export default [watchStartOutboundEmail];
