import { takeEvery, call, put, select } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';

import { FETCH_OUTBOUND_IDENTIFIER_LISTS } from './constants';

import { setOutboundIdentification } from './actions';

import { outboundIdentificationLists } from './selectors';

export function* goFetchOutboundIdentifierLists() {
  let outboundIdentifierLists;
  const currentOutboundIdentifierLists = yield select(
    outboundIdentificationLists
  );
  if (!currentOutboundIdentifierLists) {
    try {
      outboundIdentifierLists = yield call(
        sdkCallToPromise,
        CxEngage.entities.getUserOutboundIdentifierLists,
        {},
        'OutboundAniSelect'
      );
    } catch (e) {
      // Error handled in error saga
      return;
    }
    yield put(setOutboundIdentification(outboundIdentifierLists));
  }
}

export function* fetchOutboundIdentifierLists() {
  yield takeEvery(
    FETCH_OUTBOUND_IDENTIFIER_LISTS,
    goFetchOutboundIdentifierLists
  );
}

export default [fetchOutboundIdentifierLists];
