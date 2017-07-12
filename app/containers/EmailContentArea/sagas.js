/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, call, put } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import {
  setInteractionStatus,
  startOutboundInteraction,
  setContactMode,
} from 'containers/AgentDesktop/actions';
import { addContactNotification } from 'containers/ContactsControl/actions';
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
        false,
        response.interactionId
      )
    );
    yield put(
      setInteractionStatus(response.interactionId, 'initialized-outbound')
    );

    if (action.contact.id) {
      yield call(
        sdkCallToPromise,
        CxEngage.interactions.assignContact,
        {
          interactionId: response.interactionId,
          contactId: action.contact.id,
        },
        'EmailContentArea'
      );

      yield put(setContactMode(response.interactionId, 'view'));
      yield put(addContactNotification({ messageType: 'assigned' }));
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
