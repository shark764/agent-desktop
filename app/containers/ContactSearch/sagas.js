/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { call, put, takeEvery, select } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';

import { setSearchPending, setSearchResults } from 'containers/InfoTab/actions';
import {
  selectLoading,
  selectDeletionPending,
  selectCurrentInteraction,
  selectNextPage,
} from 'containers/InfoTab/selectors';
import { SEARCH_CONTACTS } from './constants';

export function* goSearchContacts() {
  const loading = yield select(selectLoading);
  const deletionPending = yield select(selectDeletionPending);
  const selectedInteraction = yield select(selectCurrentInteraction);
  const nextPage = yield select(selectNextPage);

  if (!loading || deletionPending) {
    try {
      yield put(setSearchPending(true));
      const response = yield call(
        sdkCallToPromise,
        CxEngage.contacts.search,
        createSearchQuery(selectedInteraction.query, nextPage),
        'ContactSearch'
      );
      yield put(setSearchResults(response));
      yield put(setSearchPending(false));
    } catch (error) {
      console.log(error);
    }
  }
}

export function createSearchQuery(query, nextPage) {
  const encodedQuery = {};
  Object.keys(query).forEach((queryName) => {
    const queryToEncode = query[queryName];
    const queryNoQuotes = queryToEncode.replace(/"/g, '');
    let finalQuery = queryNoQuotes;

    // here we are looking for queries that either start and end with double-quotes,
    // or are telephone queries. If they are either, then put double quotes around
    // them so that the sdk does an exact string match instead of the default partial match
    if (/^".*"$/.test(queryToEncode) || queryName === 'phone') {
      finalQuery = `"${queryNoQuotes}"`;
    }

    encodedQuery[queryName] = encodeURIComponent(finalQuery);
  });
  return {
    query: Object.assign(encodedQuery, { page: nextPage }),
  };
}

export function* searchContacts() {
  yield takeEvery(SEARCH_CONTACTS, goSearchContacts);
}

// All sagas to be loaded
export default [searchContacts];
