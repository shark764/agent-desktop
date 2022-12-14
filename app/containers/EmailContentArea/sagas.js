/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, call, put, select } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import {
  setInteractionStatus,
  startOutboundInteraction,
  removeEmailFromList,
  addEmailToList,
} from 'containers/AgentDesktop/actions';
import { getSelectedInteractionId } from 'containers/AgentDesktop/selectors';
import { START_OUTBOUND_EMAIL, ADD_EMAIL, REMOVE_EMAIL } from './constants';

export function* startOutboundEmailSaga(action) {
  let emailOutboundInteractionDetails;
  emailOutboundInteractionDetails = {
    address: action.customer,
  };
  if (action.outboundAni) {
    const {
      outboundIdentifier,
      flowId,
      value,
      outboundIdentifierListId,
    } = action.outboundAni;
    emailOutboundInteractionDetails = {
      address: action.customer,
      outboundAni: outboundIdentifier,
      flowId,
      outboundIdentifierId: value,
      outboundIdentifierListId,
    };
  }
  try {
    const response = yield call(
      sdkCallToPromise,
      CxEngage.interactions.email.startOutboundEmail,
      emailOutboundInteractionDetails,
      'EmailContentArea'
    );
    const {
      customer,
      contact,
      addedByNewInteractionPanel,
      outboundAni,
    } = action;
    yield put(
      startOutboundInteraction({
        channelType: 'email',
        customer,
        contact,
        addedByNewInteractionPanel,
        interactionId: response.interactionId,
        openSidePanel: true,
        selectedOutboundAni: outboundAni,
      })
    );
    yield put(
      setInteractionStatus(response.interactionId, 'initialized-outbound')
    );
  } catch (e) {
    // Handled in Errors Sagas
  }
}

export function* addEmailSaga(action) {
  const selectedInteractionId = yield select(getSelectedInteractionId);
  yield put(
    addEmailToList(
      selectedInteractionId,
      action.email,
      `${action.inputType}s`,
      `${action.inputType}Input`
    )
  );
}

export function* removeEmailSaga(action) {
  const selectedInteractionId = yield select(getSelectedInteractionId);
  yield put(
    removeEmailFromList(selectedInteractionId, action.index, action.list)
  );
}

// Individual exports for testing
export function* watchStartOutboundEmail() {
  yield takeEvery(START_OUTBOUND_EMAIL, startOutboundEmailSaga);
}

export function* watchAddEmail() {
  yield takeEvery(ADD_EMAIL, addEmailSaga);
}

export function* watchRemoveEmail() {
  yield takeEvery(REMOVE_EMAIL, removeEmailSaga);
}

// All sagas to be loaded
export default [watchStartOutboundEmail, watchAddEmail, watchRemoveEmail];
