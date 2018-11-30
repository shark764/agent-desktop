/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, call, put, select, all } from 'redux-saga/effects';
import axios from 'axios';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import { isUUID } from 'utils/validator';

import { getInteraction } from 'containers/ContactsControl/sagas';
import {
  addContactNotification,
  addContactErrorNotification,
} from 'containers/ContactsControl/actions';
import { selectCheckedContacts } from 'containers/InfoTab/selectors';
import {
  clearSearchResults,
  setLoading,
  setDeletionPending,
  clearCheckedContacts,
} from 'containers/InfoTab/actions';
import {
  LOAD_HISTORICAL_INTERACTION_BODY,
  LOAD_CONTACT_INTERACTION_HISTORY,
  LOAD_CRM_INTERACTION_HISTORY,
  CANCEL_CLICK_TO_DIAL,
  GO_NOT_READY,
  DELETE_CONTACTS,
  ASSIGN_CONTACT,
  WORK_ACCEPTED,
} from './constants';
import { selectCrmModule } from './selectors';
import {
  setContactMode,
  updateContactHistoryInteractionDetails,
  setContactInteractionHistory,
  setCrmInteractionHistory,
  removeContact,
  selectContact,
  setAssignedContact,
  newInteractionPanelSelectContact,
  setIsCancellingInteraction,
  showSidePanel,
  setContactSaveLoading,
  setInteractionStatus,
  setActiveResources,
  updateResourceName,
} from './actions';

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
        body.transcript =
          transcriptResponse && transcriptResponse.data
            ? transcriptResponse.data
            : [];
        break;
      default:
        break;
    }
    if (Object.keys(body).length) {
      yield put(
        updateContactHistoryInteractionDetails(action.interactionId, body)
      );
    }
  } catch (error) {
    console.error(error); // TODO fire error action?
  }
}

export function* loadContactInteractions(action) {
  try {
    const contactQuery = { contactId: action.contactId };
    if (typeof action.page !== 'undefined') {
      contactQuery.page = action.page;
    }
    const contactInteractionHistoryDetails = yield call(
      sdkCallToPromise,
      CxEngage.reporting.getContactInteractionHistory,
      contactQuery,
      'AgentDesktop'
    );

    if (!contactQuery.page) {
      let earliestTimestamp;
      if (
        contactInteractionHistoryDetails.total >
        contactInteractionHistoryDetails.results.length
      ) {
        contactQuery.page = Math.floor(
          contactInteractionHistoryDetails.total /
            contactInteractionHistoryDetails.limit
        );
        const earliestContactInteractionDetails = yield call(
          sdkCallToPromise,
          CxEngage.reporting.getContactInteractionHistory,
          contactQuery,
          'AgentDesktop'
        );
        earliestTimestamp =
          earliestContactInteractionDetails.results &&
          earliestContactInteractionDetails.results.length &&
          earliestContactInteractionDetails.results[
            earliestContactInteractionDetails.results.length - 1
          ].startTimestamp;
      } else {
        earliestTimestamp =
          contactInteractionHistoryDetails.results &&
          contactInteractionHistoryDetails.results.length &&
          contactInteractionHistoryDetails.results[
            contactInteractionHistoryDetails.results.length - 1
          ].startTimestamp;
      }
      contactInteractionHistoryDetails.earliestTimestamp = earliestTimestamp;
    }

    yield put(
      setContactInteractionHistory(
        action.contactId,
        contactInteractionHistoryDetails
      )
    );
  } catch (error) {
    console.error(error);
  }
}

export function* loadCrmInteractions(action) {
  try {
    const crm = yield select(selectCrmModule);
    const query = { crm, subType: action.subType, id: action.id };
    if (action.page !== undefined) {
      query.page = action.page;
    }
    const crmInteractionHistoryDetails = yield call(
      sdkCallToPromise,
      CxEngage.reporting.getCrmInteractions,
      query,
      'AgentDesktop'
    );

    if (crmInteractionHistoryDetails.results == null) {
      crmInteractionHistoryDetails.results = [];
    }

    if (!query.page) {
      let earliestTimestamp;
      if (
        crmInteractionHistoryDetails.total >
        crmInteractionHistoryDetails.results.length
      ) {
        query.page = Math.floor(
          crmInteractionHistoryDetails.total /
            crmInteractionHistoryDetails.limit
        );
        const earliestCrmInteractionDetails = yield call(
          sdkCallToPromise,
          CxEngage.reporting.getCrmInteractions,
          query,
          'AgentDesktop'
        );
        earliestTimestamp =
          earliestCrmInteractionDetails.results &&
          earliestCrmInteractionDetails.results.length &&
          earliestCrmInteractionDetails.results[
            earliestCrmInteractionDetails.results.length - 1
          ].startTimestamp;
      } else {
        earliestTimestamp =
          crmInteractionHistoryDetails.results &&
          crmInteractionHistoryDetails.results.length &&
          crmInteractionHistoryDetails.results[
            crmInteractionHistoryDetails.results.length - 1
          ].startTimestamp;
      }
      crmInteractionHistoryDetails.earliestTimestamp = earliestTimestamp;
    }

    yield put(
      setCrmInteractionHistory(
        action.subType,
        action.id,
        crmInteractionHistoryDetails
      )
    );
  } catch (error) {
    console.error(error);
  }
}

export function* cancelClickToDial(action) {
  yield put(setIsCancellingInteraction(action.interactionId));

  try {
    yield call(
      sdkCallToPromise,
      CxEngage.interactions.voice.cancelDial,
      { interactionId: action.interactionId },
      'AgentDesktop'
    );
  } catch (error) {
    console.error(error);
  }
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

export function* goDeleteContacts() {
  try {
    yield put(setLoading(true));
    yield put(setDeletionPending(true));
    const checkedContacts = yield select(selectCheckedContacts);
    const response = yield all(
      checkedContacts.map((contact) =>
        call(
          sdkCallToPromise,
          CxEngage.contacts.delete,
          { contactId: contact.id },
          'AgentDesktop'
        )
      )
    );
    yield checkedContacts
      .filter((contact, index) => response[index]) // Check API response is truthy
      .map((contact) => put(removeContact(contact.id)));

    yield put(clearSearchResults());
    yield put(clearCheckedContacts());
    yield put(setDeletionPending(false));
    yield put(setLoading(false));
    yield put(
      addContactNotification({
        messageType: checkedContacts.length > 1 ? 'deletedMultiple' : 'deleted',
      })
    );
  } catch (error) {
    yield put(
      addContactErrorNotification({
        errorType: 'serverError',
        messageType: 'notDeleted',
      })
    );
    console.error(error);
  }
}

export function* goAssignContact(action) {
  const interaction = yield call(getInteraction, action.interactionId);
  if (!interaction) {
    console.warn(
      `Interaction not found: ${
        action.interactionId
      } . Aborting goAssignContact`
    );
    return;
  }
  yield put(setContactSaveLoading(interaction.interactionId, true));
  if (interaction.interactionId === undefined) {
    yield put(selectContact(action.contact));
  } else if (interaction.interactionId === 'creating-new-interaction') {
    yield put(newInteractionPanelSelectContact(action.contact));
    yield put(showSidePanel(interaction.interactionId));
  } else if (
    !isUUID(interaction.interactionId) ||
    interaction.status === 'script-only'
  ) {
    yield put(setAssignedContact(interaction.interactionId, action.contact));
  } else {
    try {
      if (
        interaction.contact &&
        interaction.contact.id &&
        !action.skipUnassign
      ) {
        yield call(
          sdkCallToPromise,
          CxEngage.interactions.unassignContact,
          {
            interactionId: interaction.interactionId,
            contactId: interaction.contact.id,
          },
          'AgentDesktop'
        );
      }
      yield call(
        sdkCallToPromise,
        CxEngage.interactions.assignContact,
        {
          interactionId: interaction.interactionId,
          contactId: action.contact.id,
        },
        'AgentDesktop'
      );
      yield put(setAssignedContact(interaction.interactionId, action.contact)); // TODO: tidy up so errors can know if assign happened
      yield put(addContactNotification({ messageType: 'assigned' }));
    } catch (error) {
      yield put(setContactSaveLoading(interaction.interactionId, false));
      yield put(setContactMode(interaction.interactionId, 'search'));
      yield put(
        addContactErrorNotification({
          errorType: 'serverError',
          messageType: 'notAssigned',
        })
      );
      return;
    }
  }
  if (interaction.contactMode === 'search') {
    yield put(setContactMode(interaction.interactionId, 'view'));
  }
  yield call(loadContactInteractions, { contactId: action.contact.id });
  yield put(setContactSaveLoading(interaction.interactionId, false));
}

export function* goAcceptWork(action) {
  yield put(
    setInteractionStatus(action.interactionId, 'work-accepted', action.response)
  );
  if (action.response.activeResources) {
    yield put(
      setActiveResources(action.interactionId, action.response.activeResources)
    );
    const resourcesInfo = yield all(
      action.response.activeResources
        .filter((resource) => resource.externalResource === false)
        .map((resource) =>
          call(
            sdkCallToPromise,
            CxEngage.entities.getUser,
            {
              resourceId: resource.id,
            },
            'AgentDesktop'
          )
        )
    );
    yield all(
      resourcesInfo.map((response) => {
        const { firstName, lastName, id, email } = response.result;
        const name = firstName || lastName ? `${firstName} ${lastName}` : email;
        return put(updateResourceName(action.interactionId, id, name));
      })
    );
  }
}

// Individual exports for testing
export function* historicalInteractionBody() {
  yield takeEvery(
    LOAD_HISTORICAL_INTERACTION_BODY,
    loadHistoricalInteractionBody
  );
}

export function* contactInteractionHistory() {
  yield takeEvery(LOAD_CONTACT_INTERACTION_HISTORY, loadContactInteractions);
}

export function* crmInteractionHistory() {
  yield takeEvery(LOAD_CRM_INTERACTION_HISTORY, loadCrmInteractions);
}

export function* notReady() {
  yield takeEvery(GO_NOT_READY, goNotReady);
}

export function* cancelDial() {
  yield takeEvery(CANCEL_CLICK_TO_DIAL, cancelClickToDial);
}

export function* deleteContacts() {
  yield takeEvery(DELETE_CONTACTS, goDeleteContacts);
}

export function* assignContact() {
  yield takeEvery(ASSIGN_CONTACT, goAssignContact);
}

export function* workAccepted() {
  yield takeEvery(WORK_ACCEPTED, goAcceptWork);
}

// All sagas to be loaded
export default [
  historicalInteractionBody,
  contactInteractionHistory,
  crmInteractionHistory,
  notReady,
  deleteContacts,
  assignContact,
  cancelDial,
  workAccepted,
];
