/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, call, put } from 'redux-saga/effects';
import axios from 'axios';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import { updateContactHistoryInteractionDetails, setContactInteractionHistory, removeContact } from 'containers/AgentDesktop/actions';
import { clearSearchResults, setLoading } from 'containers/InfoTab/actions';
import { LOAD_HISTORICAL_INTERACTION_BODY, LOAD_CONTACT_INTERACTION_HISTORY, GO_NOT_READY, DELETE_CONTACTS } from 'containers/AgentDesktop/constants';

export function* loadHistoricalInteractionBody(action) {
  const body = {};
  let metaData;
  let transcriptResponse;
  let transcriptUrl;
  try {
    switch (action.bodyType) {
      case 'recordings':
        metaData = yield call(
          sdkCallToPromise,
          CxEngage.interactions.voice.getRecordings,
          { interactionId: action.interactionId },
          'AgentDesktop'
        );
        body.audioRecordings = metaData.map((recording) => recording.url);
        break;
      case 'transcript':
        metaData = yield call(
          sdkCallToPromise,
          CxEngage.interactions.messaging.getTranscripts,
          { interactionId: action.interactionId },
          'AgentDesktop'
        );
        transcriptUrl = metaData[0] && metaData[0].url;
        if (transcriptUrl) {
          transcriptResponse = yield call(axios.get, transcriptUrl);
        }
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
  const contactQuery = { contactId: action.contactId };
  if (typeof action.page !== 'undefined') {
    contactQuery.page = action.page;
  }
  try {
    contactInteractionHistoryDetails = yield call(
      sdkCallToPromise,
      CxEngage.reporting.getContactInteractionHistory,
      contactQuery,
      'AgentDesktop'
    );
  } catch (error) {
    console.error(error);
  }

  if (!contactQuery.page) {
    let earliestTimestamp;
    if (contactInteractionHistoryDetails.total > contactInteractionHistoryDetails.results.length) {
      contactQuery.page = Math.floor(contactInteractionHistoryDetails.total / contactInteractionHistoryDetails.limit);
      try {
        const earliestContactInteractionDetails = yield call(
          sdkCallToPromise,
          CxEngage.reporting.getContactInteractionHistory,
          contactQuery,
          'AgentDesktop'
        );
        earliestTimestamp =
          earliestContactInteractionDetails.results &&
          earliestContactInteractionDetails.results.length &&
          earliestContactInteractionDetails.results[earliestContactInteractionDetails.results.length - 1].startTimestamp;
      } catch (error) {
        console.error(error);
      }
    } else {
      earliestTimestamp =
        contactInteractionHistoryDetails.results &&
        contactInteractionHistoryDetails.results.length &&
        contactInteractionHistoryDetails.results[contactInteractionHistoryDetails.results.length - 1].startTimestamp;
    }
    contactInteractionHistoryDetails.earliestTimestamp = earliestTimestamp;
  }

  yield put(setContactInteractionHistory(action.contactId, contactInteractionHistoryDetails));
}

export function* goNotReady(action) {
  const parameters = {};
  if (typeof action.reason !== 'undefined') {
    parameters.reasonInfo = {
      reasonListId: action.listId,
      reasonId: action.reason.reasonId,
      reason: action.reason.name,
    };
  }
  try {
    yield call(
      sdkCallToPromise,
      CxEngage.session.goNotReady,
      parameters,
      'AgentDesktop'
    );
  } catch (error) {
    console.error(error);
  }
}

export function* goDeleteContacts(action) {
  try {
    const response = yield action.contactIds.map((contactId) => call(
      sdkCallToPromise,
      CxEngage.contacts.delete,
      { contactId },
      'AgentDesktop'
    ));
    yield action.contactIds
      .filter((contactId, index) => response[index]) // API response is bool
      .map((contactId) => put(removeContact(contactId)));
    yield put(clearSearchResults());
    yield put(setLoading(false));
  } catch (error) {
    console.error(error);
  }
}

// Individual exports for testing
export function* historicalInteractionBody() {
  yield takeEvery(LOAD_HISTORICAL_INTERACTION_BODY, loadHistoricalInteractionBody);
}

export function* contactInteractionHistory() {
  yield takeEvery(LOAD_CONTACT_INTERACTION_HISTORY, loadContactInteractions);
}

export function* notReady() {
  yield takeEvery(GO_NOT_READY, goNotReady);
}

export function* deleteContacts() {
  yield takeEvery(DELETE_CONTACTS, goDeleteContacts);
}

// All sagas to be loaded
export default [
  historicalInteractionBody,
  contactInteractionHistory,
  notReady,
  deleteContacts,
];
