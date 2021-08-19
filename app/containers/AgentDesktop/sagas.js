/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, call, put, select, all } from 'redux-saga/effects';
import axios from 'axios';
import { delay } from 'redux-saga';

import sdkCallToPromise from 'utils/sdkCallToPromise';
import { isUUID } from 'utils/validator';
import { isDesktop } from 'utils/url';
import { generateUUID } from 'utils/uuid';

import { selectTenant, selectAgent } from 'containers/Login/selectors';
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
  UNASSIGNING_CONTACT,
  WORK_ACCEPTED,
  UPDATE_INTERACTION_TRANSFER_LISTS_$,
  UPDATE_INTERACTION_TRANSFER_LIST_VISIBLE_STATE_$,
  UPDATE_VISIBLE_STATE_OF_ALL_INTERACTION_TRANSFER_LISTS_$,
  SELECT_INTERACTION,
  ADD_SMOOCH_MESSAGE,
  SET_AWAITING_DISPOSITION_$,
} from './constants';
import {
  selectCrmModule,
  getSelectedInteraction,
  selectVoiceInteraction,
  selectVoiceFlowTransLists,
  selectNonVoiceFlowTransLists,
  selectInterAssigTransListsVisibleSt,
  selectInterAssigAllTransListsVisibleSt,
  getIsConversationUnread,
  selectTotalWrapUpTime,
  interactionsInWrapup,
} from './selectors';
import {
  setContactMode,
  unassignContact,
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
  setInteractionTransferLists,
  setInteractionTransferListsLoadingState,
  setInteractionTransferListsVisibleState,
  setVisibleStateOfAllInteractionTransferLists,
  setCustomerTyping,
  setCustomerRead,
  setConversationIsUnread,
  toggleInteractionIsHolding,
  setAwaitingDispositionSpinner,
} from './actions';

const getTranscript = (files) => {
  let transcript = files.find(
    (transcriptFile) =>
      transcriptFile.metadata && transcriptFile.metadata.transcript
  );
  if (!transcript) {
    transcript = files[0];
  }
  return transcript;
};

const getFileMetadata = (files, messageId) =>
  files.find(
    (file) => file && file.metadata && file.metadata.messageId === messageId
  );

export const getQuotedFileMetadata = (content, messagesHistory) => {
  let file;
  if (content && messagesHistory) {
    const selectedMessage = messagesHistory.filter(
      (item) => item.payload.body.id === content.id
    )[0];
    if (selectedMessage) {
      if (
        selectedMessage.payload.body.file &&
        selectedMessage.payload.body.file.mediaUrl
      ) {
        file = selectedMessage.payload.body.file;
      }
    }
  }
  return file;
};

export const getQuotedMessage = (
  newTranscriptMsg,
  transcriptMsg,
  transcriptResponse
) => {
  const foundMsg = getQuotedFileMetadata(
    transcriptMsg.payload.body.quotedMessage.content,
    transcriptResponse
  );
  if (foundMsg && foundMsg.mediaUrl) {
    newTranscriptMsg.payload.body.quotedMessage.content.file.mediaUrl =
      foundMsg.mediaUrl;
    newTranscriptMsg.payload.body.quotedMessage.content.file.fileName =
      foundMsg.fileName ||
      decodeURIComponent(foundMsg.mediaUrl)
        .split('/')
        [foundMsg.mediaUrl.split('/').length - 1].split('?')[0];
  } else if (newTranscriptMsg.payload.body.quotedMessage.content.file.mediaUrl.indexOf('smooch') >= 0) {
    // If artifact file url doesn't exist,
    // we delete smooch one
    delete newTranscriptMsg.payload.body.quotedMessage.content.file.mediaUrl;
  }
  return newTranscriptMsg;
};

export function* loadHistoricalInteractionBody(action) {
  const body = {};
  let metaData;
  let transcriptResponse;
  let transcript;
  let transcriptUrl;
  try {
    switch (action.bodyType) {
      case 'recordings':
        metaData = yield call(
          sdkCallToPromise,
          CxEngage.entities.getRecordings,
          { interactionId: action.interactionId },
          'AgentDesktop'
        );
        body.audioRecordings = metaData;
        break;
      case 'transcript':
        metaData = yield call(
          sdkCallToPromise,
          CxEngage.interactions.messaging.getTranscripts,
          { interactionId: action.interactionId },
          'AgentDesktop'
        );
        transcript = getTranscript(metaData);
        transcriptUrl = transcript && transcript.url;
        if (transcriptUrl) {
          transcriptResponse = yield call(axios.get, transcriptUrl);
        }
        if (transcriptResponse && transcriptResponse.data) {
          body.transcript = transcriptResponse.data.map((transcriptMsg) => {
            const newTranscriptMsg = transcriptMsg;
            if (
              transcriptMsg.payload &&
              transcriptMsg.payload.body &&
              transcriptMsg.payload.body.file &&
              transcriptMsg.payload.body.file.mediaType
            ) {
              const foundMsg = getFileMetadata(
                metaData,
                transcriptMsg.payload.body.id
              );
              if (foundMsg && foundMsg.url) {
                newTranscriptMsg.payload.body.file.mediaUrl = foundMsg.url;
                newTranscriptMsg.payload.body.file.fileName =
                  foundMsg.filename ||
                  decodeURIComponent(foundMsg.url)
                    .split('/')
                    [foundMsg.url.split('/').length - 1].split('?')[0];
              } else if (newTranscriptMsg.payload.body.file.mediaUrl.indexOf('smooch') >= 0) {
                // If artifact file url doesn't exist,
                // we delete smooch one
                delete newTranscriptMsg.payload.body.file.mediaUrl;
              }
              if (
                transcriptMsg.payload &&
                transcriptMsg.payload.body &&
                transcriptMsg.payload.body.quotedMessage &&
                transcriptMsg.payload.body.quotedMessage.content &&
                transcriptMsg.payload.body.quotedMessage.content.file &&
                transcriptMsg.payload.body.quotedMessage.content.file.mediaType
              ) {
                getQuotedMessage(
                  newTranscriptMsg,
                  transcriptMsg,
                  transcriptResponse.data
                );
              }
              return newTranscriptMsg;
            } else if (
              transcriptMsg.payload &&
              transcriptMsg.payload.body &&
              transcriptMsg.payload.body.quotedMessage &&
              transcriptMsg.payload.body.quotedMessage.content &&
              transcriptMsg.payload.body.quotedMessage.content.file &&
              transcriptMsg.payload.body.quotedMessage.content.file.mediaType
            ) {
              return getQuotedMessage(
                newTranscriptMsg,
                transcriptMsg,
                transcriptResponse.data
              );
            } else {
              return transcriptMsg;
            }
          });
        } else {
          body.transcript = [];
        }
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
      `Interaction not found: ${action.interactionId} . Aborting goAssignContact`
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

export function* goUnassignContact(action) {
  const interaction = yield call(getInteraction, action.interactionId);
  if (!interaction) {
    console.warn(
      `Interaction not found: ${action.interactionId} . Aborting goUnassignContact`
    );
    return;
  }
  try {
    if (interaction.contact && interaction.contact.id) {
      yield call(
        sdkCallToPromise,
        CxEngage.interactions.unassignContact,
        {
          interactionId: interaction.interactionId,
          contactId: interaction.contact.id,
        },
        'AgentDesktop'
      );
      yield put(unassignContact(interaction.interactionId, true));
      yield put(
        addContactNotification({ messageType: 'contactWasUnassigned' })
      );
      yield put(setContactMode(interaction.interactionId, 'search'));
      yield put(setContactSaveLoading(interaction.interactionId, false));
    }
  } catch (error) {
    yield put(setContactSaveLoading(interaction.interactionId, false));
    yield put(
      addContactErrorNotification({
        errorType: 'serverError',
        messageType: 'notUnassigned',
      })
    );
  }
}

export function* goAcceptWork(action) {
  const selectedInteraction = yield select(getSelectedInteraction);
  yield put(
    setInteractionStatus(action.interactionId, 'work-accepted', action.response)
  );
  yield put(
    setInteractionTransferListsLoadingState(
      selectedInteraction.interactionId,
      true
    )
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
  } else {
    const interaction = yield call(getInteraction, action.interactionId);
    if (!interaction) {
      console.warn(
        `Interaction not found: ${action.interactionId} . Aborting goAcceptWork to resume customer`
      );
      return;
    }

    if (interaction.onHold === true) {
      yield put(toggleInteractionIsHolding(action.interactionId, true));
      try {
        yield call(
          sdkCallToPromise,
          CxEngage.interactions.voice.customerResume,
          { interactionId: action.interactionId },
          'AgentDesktop'
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (isDesktop() && interaction.contact) {
      console.log('Auto-assigning Desktop contact');

      yield call(goAssignContact, {
        interactionId: interaction.interactionId,
        contact: interaction.contact,
        skipUnassign: true,
      });
    }
  }
}

export function* callTransferListsFromFlowAndUpdateState(action) {
  const [
    tenant,
    agent,
    selectedInteraction,
    voiceInteraction,
    voiceFlowTransLists,
    nonVoiceFlowTransLists,
  ] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(getSelectedInteraction),
    select(selectVoiceInteraction),
    select(selectVoiceFlowTransLists),
    select(selectNonVoiceFlowTransLists),
  ]);
  let interactionTransferLists = [];
  if (
    voiceFlowTransLists !== undefined ||
    nonVoiceFlowTransLists !== undefined
  ) {
    let tenantTransferLists;
    try {
      tenantTransferLists = yield call(
        sdkCallToPromise,
        CxEngage.entities.getTransferLists,
        {},
        'AgentDesktop'
      );
      if (
        tenantTransferLists &&
        tenantTransferLists.result &&
        tenantTransferLists.result.length > 0
      ) {
        const activeTransferLists = tenantTransferLists.result
          .filter((transferList) => transferList.active === true)
          .map(({ id, name, endpoints }) => {
            const updatedEndpoints = [];
            endpoints.forEach((endpoint) => {
              // Creating hierarchy and endpoint UUID's to use them as keys while rendering - similar hierarchy's should have the same hierarchyRenderUUID
              const existingHierarchy = updatedEndpoints.find(
                (val) => endpoint.hierarchy === val.hierarchy
              );
              if (existingHierarchy === undefined) {
                updatedEndpoints.push({
                  ...endpoint,
                  endPointRenderUUID: generateUUID(),
                  hierarchyRenderUUID: generateUUID(),
                });
              } else {
                updatedEndpoints.push({
                  ...endpoint,
                  endPointRenderUUID: generateUUID(),
                  hierarchyRenderUUID: existingHierarchy.hierarchyRenderUUID,
                });
              }
            });
            return {
              id,
              name,
              endpoints: updatedEndpoints,
              transferListRenderUUID: generateUUID(),
            };
          });
        // setting voice interaction transfer lists:
        if (action.channelType === 'voice') {
          if (
            voiceFlowTransLists !== undefined &&
            activeTransferLists.length > 0
          ) {
            // Based on the flow transfer lists id && name (voiceFlowTransLists=[{type: 'id', value: '123-456-abc} {type: 'name', value: 'transferlist1'}])
            // we are finding transfer lists in the tenant with proper endpoints, transferlist-id & transfer-list name
            interactionTransferLists = voiceFlowTransLists.reduce(
              (accumulator, currentValue) => {
                const activeVocieTransList = activeTransferLists.find(
                  ({ id, name }) =>
                    currentValue.value === id ||
                    currentValue.value.toUpperCase() === name.toUpperCase()
                );
                // By mistake users may add duplicate transfer lists in a flow, which are getting filtered out below:
                if (
                  activeVocieTransList &&
                  accumulator.findIndex(
                    ({ id }) => id === activeVocieTransList.id
                  ) === -1
                ) {
                  accumulator.push(activeVocieTransList);
                }
                return accumulator;
              },
              []
            );
            yield put(
              setInteractionTransferLists(
                voiceInteraction.interactionId,
                interactionTransferLists
              )
            );
          } else {
            yield put(
              setInteractionTransferLists(
                voiceInteraction.interactionId,
                undefined
              )
            );
          }
        }
        // setting non- voice interaction transfer lists:
        else if (action.channelType === 'nonVoice') {
          if (
            nonVoiceFlowTransLists !== undefined &&
            activeTransferLists.length > 0
          ) {
            // Based on the flow transfer lists id && name (nonVoiceFlowTransLists=[{type: 'id', value: '123-456-abc} {type: 'name', value: 'transferlist1'}])
            // we are finding transfer lists in the tenant with proper endpoints, transferlist-id & transfer-list name
            interactionTransferLists = nonVoiceFlowTransLists.reduce(
              (accumulator, currentValue) => {
                const activeNonVocieTransList = activeTransferLists.find(
                  ({ id, name }) =>
                    currentValue.value === id ||
                    currentValue.value.toUpperCase() === name.toUpperCase()
                );
                // By mistake users may add duplicate transfer lists in a flow, which are getting filtered out below:
                if (activeNonVocieTransList) {
                  const queueEndPoints = activeNonVocieTransList.endpoints.filter(
                    (endpoint) => endpoint.contactType === 'queue'
                  );
                  // PSTN and SIP contactType transfer-lists should be removed from non-voice transfer lists:
                  // Only queueEndpoints should be included:
                  if (
                    queueEndPoints.length > 0 &&
                    accumulator.findIndex(
                      ({ id }) => id === activeNonVocieTransList.id
                    ) === -1
                  ) {
                    accumulator.push({
                      id: activeNonVocieTransList.id,
                      name: activeNonVocieTransList.name,
                      endpoints: queueEndPoints,
                      transferListRenderUUID:
                        activeNonVocieTransList.transferListRenderUUID,
                    });
                  }
                }
                return accumulator;
              },
              []
            );
            yield put(
              setInteractionTransferLists(
                selectedInteraction.interactionId,
                interactionTransferLists
              )
            );
          } else {
            yield put(
              setInteractionTransferLists(
                selectedInteraction.interactionId,
                undefined
              )
            );
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    // setting initial visible state of interaction transfer-lists:
    const interactionTransferListsVisibleState = interactionTransferLists.reduce(
      (newObj, list) => ({
        ...newObj,
        [list.id]:
          localStorage.getItem(
            `flowTransferListHiddenState/${tenant.id}/${agent.userId}/${list.id}`
          ) !== 'false',
      }),
      {}
    );
    yield put(
      setInteractionTransferListsVisibleState(
        interactionTransferListsVisibleState
      )
    );
    // setting visible state of all Interaction transfer-lists:
    if (interactionTransferLists.length > 0) {
      const visibleStateofAllInteractionTrasferLists =
        localStorage.getItem(
          `visibleStateOfAllInteractionTransferLists/${tenant.id}/${agent.userId}`
        ) !== 'false';
      yield put(
        setVisibleStateOfAllInteractionTransferLists(
          visibleStateofAllInteractionTrasferLists
        )
      );
    } else {
      yield put(setVisibleStateOfAllInteractionTransferLists(null));
    }
  } else if (
    action.channelType === 'voice' &&
    voiceFlowTransLists === undefined
  ) {
    yield put(
      setInteractionTransferLists(voiceInteraction.interactionId, undefined)
    );
  } else if (
    action.channelType === 'nonVoice' &&
    nonVoiceFlowTransLists === undefined
  ) {
    yield put(
      setInteractionTransferLists(selectedInteraction.interactionId, undefined)
    );
  }
}
export function* changeInteractionTransferListVisibleState(action) {
  const [tenant, agent, prevTransferListsVisibleState] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectInterAssigTransListsVisibleSt),
  ]);
  const interactionTransferLists = { ...prevTransferListsVisibleState };
  interactionTransferLists[action.transferListId] = !interactionTransferLists[
    action.transferListId
  ];
  yield put(setInteractionTransferListsVisibleState(interactionTransferLists));
  localStorage.setItem(
    `flowTransferListHiddenState/${tenant.id}/${agent.userId}/${action.transferListId}`,
    interactionTransferLists[action.transferListId]
  );
}

export function* updateVisibleStateofAllFlowTransferLists() {
  const [tenant, agent, visibleStateofAllInteractionTrasferLists] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectInterAssigAllTransListsVisibleSt),
  ]);
  yield put(
    setVisibleStateOfAllInteractionTransferLists(
      !visibleStateofAllInteractionTrasferLists
    )
  );
  localStorage.setItem(
    `visibleStateOfAllInteractionTransferLists/${tenant.id}/${agent.userId}`,
    !visibleStateofAllInteractionTrasferLists
  );
}

export function* doSetConversationRead() {
  const selectedInteraction = yield select(getSelectedInteraction);
  if (
    yield select(getIsConversationUnread) &&
      selectedInteraction.channelType !== 'sms' &&
      selectedInteraction.source === 'smooch'
  ) {
    CxEngage.interactions.smoochMessaging.sendConversationRead({
      interactionId: selectedInteraction.interactionId,
    });
    yield put(
      setConversationIsUnread(selectedInteraction.interactionId, false)
    );
  }
}

export function* doHandleNewSmoochMessage({ interactionId, message }) {
  if (message.type === 'customer') {
    const selectedInteraction = yield select(getSelectedInteraction);
    yield put(setCustomerTyping(interactionId, false));
    yield put(setCustomerRead(interactionId, false));

    if (interactionId !== selectedInteraction.interactionId) {
      yield put(setConversationIsUnread(interactionId, true));
    } else if (selectedInteraction.channelType !== 'sms') {
      CxEngage.interactions.smoochMessaging.sendConversationRead({
        interactionId: selectedInteraction.interactionId,
      });
    }
  }
}

export function* doSetAwaitingDisposition({ interactionId }) {
  const totalWrapUpTime = yield select(selectTotalWrapUpTime);
  yield call(delay, totalWrapUpTime);
  yield put(setAwaitingDispositionSpinner(interactionId));
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

export function* unassigningContact() {
  yield takeEvery(UNASSIGNING_CONTACT, goUnassignContact);
}

export function* workAccepted() {
  yield takeEvery(WORK_ACCEPTED, goAcceptWork);
}

export function* updateInteractionTransferLists() {
  yield takeEvery(
    UPDATE_INTERACTION_TRANSFER_LISTS_$,
    callTransferListsFromFlowAndUpdateState
  );
}

export function* updateInteractionTransferListsVisibleState() {
  yield takeEvery(
    UPDATE_INTERACTION_TRANSFER_LIST_VISIBLE_STATE_$,
    changeInteractionTransferListVisibleState
  );
}

export function* updateVisibleStateOfAllInteractionTransferlists() {
  yield takeEvery(
    UPDATE_VISIBLE_STATE_OF_ALL_INTERACTION_TRANSFER_LISTS_$,
    updateVisibleStateofAllFlowTransferLists
  );
}

export function* setConversationRead() {
  yield takeEvery(SELECT_INTERACTION, doSetConversationRead);
}

export function* handleNewSmoochMessage() {
  yield takeEvery(ADD_SMOOCH_MESSAGE, doHandleNewSmoochMessage);
}

export function* setAwaitingDisposition() {
  yield takeEvery(SET_AWAITING_DISPOSITION_$, doSetAwaitingDisposition);
}

export function* terminateWrapupInteractions() {
  while (true) {
    const wrapedInteractios = yield select(interactionsInWrapup);
    if (wrapedInteractios) {
      for (const interaction of wrapedInteractios) {
        const ageSeconds = Math.round(
          (Date.now() - interaction.wrapupStarted) / 1000
        );
        const awaitingDisposition =
          interaction.dispositionDetails &&
          interaction.dispositionDetails.forceSelect &&
          interaction.dispositionDetails.selected.length === 0;
        const awaitingScript =
          interaction.script !== undefined &&
          !interaction.script.autoScriptDismiss;
        if (
          interaction.status === 'wrapup' &&
          ageSeconds > interaction.wrapupDetails.wrapupTime &&
          !awaitingDisposition &&
          !awaitingScript
        ) {
          yield call(
            sdkCallToPromise,
            CxEngage.interactions.endWrapup,
            { interactionId: interaction.interactionId },
            'AgentDesktop'
          );
        }
      }
    }
    yield delay(1000);
  }
}

// All sagas to be loaded
export default [
  historicalInteractionBody,
  contactInteractionHistory,
  crmInteractionHistory,
  notReady,
  deleteContacts,
  assignContact,
  unassigningContact,
  cancelDial,
  workAccepted,
  updateInteractionTransferLists,
  updateInteractionTransferListsVisibleState,
  updateVisibleStateOfAllInteractionTransferlists,
  setConversationRead,
  handleNewSmoochMessage,
  setAwaitingDisposition,
  terminateWrapupInteractions,
];
