/*
 *
 * AgentDesktop actions
 *
 */

import {
  SET_USER_CONFIG,
  SET_EXTENSIONS,
  UPDATE_WRAPUP_DETAILS,
  ADD_SCRIPT,
  REMOVE_SCRIPT,
  SET_ACTIVE_EXTENSION,
  SET_QUEUES,
  SET_PRESENCE,
  SET_PRESENCE_REASON_ID,
  GO_NOT_READY,
  START_OUTBOUND_INTERACTION,
  ADD_INTERACTION,
  WORK_INITIATED,
  SET_INTERACTION_QUERY,
  SET_MESSAGE_HISTORY,
  SET_CONTACT_ACTION,
  ASSIGN_CONTACT,
  SET_SIDE_PANEL_TAB_INDEX,
  SET_CONTACT_INTERACTION_HISTORY,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS,
  LOAD_CONTACT_INTERACTION_HISTORY,
  LOAD_HISTORICAL_INTERACTION_BODY,
  UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS,
  ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY,
  UPDATE_CONTACT,
  ADD_MESSAGE,
  SET_INTERACTION_STATUS,
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  REMOVE_INTERACTION,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  SET_EMAIL_PLAIN_BODY,
  SET_EMAIL_HTML_BODY,
  SELECT_CONTACT,
  SET_EMAIL_DETAILS,
  SET_EMAIL_ATTACHMENT_URL,
  START_WARM_TRANSFERRING,
  TRANSFER_CANCELLED,
  RESOURCE_ADDED,
  UPDATE_RESOURCE_NAME,
  UPDATE_RESOURCE_STATUS,
  HOLD_ME,
  RESUME_ME,
  RESOURCE_REMOVED,
  MUTE_CALL,
  UNMUTE_CALL,
  HOLD_CALL,
  RESUME_CALL,
  RECORD_CALL,
  STOP_RECORD_CALL,
  EMAIL_CREATE_REPLY,
  EMAIL_ADD_ATTACHMENT,
  EMAIL_REMOVE_ATTACHMENT,
  EMAIL_UPDATE_REPLY,
  EMAIL_CANCEL_REPLY,
  EMAIL_SEND_REPLY,
  UPDATE_NOTE,
  UPDATE_SCRIPT_VALUES,
  SET_DISPOSITION_DETAILS,
  SELECT_DISPOSITION,
  SHOW_REFRESH_NOTIF,
} from './constants';

export function setUserConfig(response) {
  return {
    type: SET_USER_CONFIG,
    response,
  };
}

export function setExtensions(response) {
  return {
    type: SET_EXTENSIONS,
    response,
  };
}

export function updateWrapupDetails(interactionId, wrapupDetails) {
  return {
    type: UPDATE_WRAPUP_DETAILS,
    interactionId,
    wrapupDetails,
  };
}

export function addScript(interactionId, script) {
  return {
    type: ADD_SCRIPT,
    interactionId,
    script,
  };
}

export function removeScript(interactionId) {
  return {
    type: REMOVE_SCRIPT,
    interactionId,
  };
}

export function setActiveExtension(activeExtension) {
  return {
    type: SET_ACTIVE_EXTENSION,
    activeExtension,
  };
}

export function setQueues(queues) {
  return {
    type: SET_QUEUES,
    queues,
  };
}

export function setPresence(response, reasonId) {
  return {
    type: SET_PRESENCE,
    response,
    reasonId,
  };
}

export function setPresenceReasonId(reasonId, listId) {
  return {
    type: SET_PRESENCE_REASON_ID,
    reasonId,
    listId,
  };
}

export function goNotReady(reason, listId) {
  return {
    type: GO_NOT_READY,
    reason,
    listId,
  };
}

export function startOutboundInteraction(channelType) {
  return {
    type: START_OUTBOUND_INTERACTION,
    channelType,
  };
}

export function addInteraction(response) {
  return {
    type: ADD_INTERACTION,
    response,
  };
}

export function workInitiated(response) {
  return {
    type: WORK_INITIATED,
    response,
  };
}
export function setInteractionQuery(interactionId, query) {
  return {
    type: SET_INTERACTION_QUERY,
    interactionId,
    query,
  };
}
export function addSearchFilter(filterName, value) {
  return {
    type: ADD_SEARCH_FILTER,
    filterName,
    value,
  };
}
export function removeSearchFilter(filterName) {
  return {
    type: REMOVE_SEARCH_FILTER,
    filterName,
  };
}

export function setContactAction(interactionId, newAction) {
  return {
    type: SET_CONTACT_ACTION,
    interactionId,
    newAction,
  };
}

export function setMessageHistory(response) {
  return {
    type: SET_MESSAGE_HISTORY,
    response,
  };
}

export function assignContact(interactionId, contact) {
  return {
    type: ASSIGN_CONTACT,
    interactionId,
    contact,
  };
}

export function setSidePanelTabIndex(interactionId, tabIndex) {
  return {
    type: SET_SIDE_PANEL_TAB_INDEX,
    interactionId,
    tabIndex,
  };
}

export function setContactInteractionHistory(contactId, response) {
  return {
    type: SET_CONTACT_INTERACTION_HISTORY,
    contactId,
    response,
  };
}

export function setContactHistoryInteractionDetailsLoading(interactionId, contactHistoryInteractionId) {
  return {
    type: SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING,
    interactionId,
    contactHistoryInteractionId,
  };
}

export function setContactHistoryInteractionDetails(response) {
  return {
    type: SET_CONTACT_HISTORY_INTERACTION_DETAILS,
    response,
  };
}

export function loadContactInteractionHistory(contactId, page) {
  return {
    type: LOAD_CONTACT_INTERACTION_HISTORY,
    contactId,
    page,
  };
}

export function loadHistoricalInteractionBody(interactionId, bodyType) {
  return {
    type: LOAD_HISTORICAL_INTERACTION_BODY,
    interactionId,
    bodyType,
  };
}

export function updateContactHistoryInteractionDetails(interactionId, interactionDetails) {
  return {
    type: UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS,
    interactionId,
    interactionDetails,
  };
}

export function addNotesToContactInteractionHistory(contactHistoryInteractionId, response) {
  return {
    type: ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY,
    contactHistoryInteractionId,
    response,
  };
}

export function updateContact(updatedContact) {
  return {
    type: UPDATE_CONTACT,
    updatedContact,
  };
}


export function selectContact(contact) {
  return {
    type: SELECT_CONTACT,
    contact,
  };
}

export function addMessage(response) {
  return {
    type: ADD_MESSAGE,
    response,
  };
}

export function setInteractionStatus(interactionId, newStatus, response) {
  return {
    type: SET_INTERACTION_STATUS,
    interactionId,
    newStatus,
    response,
  };
}

export function removeInteraction(interactionId) {
  return {
    type: REMOVE_INTERACTION,
    interactionId,
  };
}

export function selectInteraction(interactionId) {
  return {
    type: SELECT_INTERACTION,
    interactionId,
  };
}

export function setCustomFields(interactionId, customFields) {
  return {
    type: SET_CUSTOM_FIELDS,
    interactionId,
    customFields,
  };
}

export function setEmailPlainBody(interactionId, body) {
  return {
    type: SET_EMAIL_PLAIN_BODY,
    interactionId,
    body,
  };
}

export function setEmailHtmlBody(interactionId, body) {
  return {
    type: SET_EMAIL_HTML_BODY,
    interactionId,
    body,
  };
}

export function setEmailDetails(interactionId, details) {
  return {
    type: SET_EMAIL_DETAILS,
    interactionId,
    details,
  };
}

export function setEmailAttachmentUrl(interactionId, artifactFileId, url) {
  return {
    type: SET_EMAIL_ATTACHMENT_URL,
    interactionId,
    artifactFileId,
    url,
  };
}

export function startWarmTransferring(interactionId, transferringTo) {
  return {
    type: START_WARM_TRANSFERRING,
    interactionId,
    transferringTo,
  };
}

export function transferCancelled(interactionId) {
  return {
    type: TRANSFER_CANCELLED,
    interactionId,
  };
}

export function resourceAdded(response) {
  return {
    type: RESOURCE_ADDED,
    response,
  };
}

export function updateResourceName(response) {
  return {
    type: UPDATE_RESOURCE_NAME,
    response,
  };
}

export function updateResourceStatus(interactionId, targetResource, statusKey, statusValue) {
  return {
    type: UPDATE_RESOURCE_STATUS,
    interactionId,
    targetResource,
    statusKey,
    statusValue,
  };
}

export function holdMe(interactionId) {
  return {
    type: HOLD_ME,
    interactionId,
  };
}

export function resumeMe(interactionId) {
  return {
    type: RESUME_ME,
    interactionId,
  };
}

export function resourceRemoved(response) {
  return {
    type: RESOURCE_REMOVED,
    response,
  };
}

export function muteCall(interactionId) {
  return {
    type: MUTE_CALL,
    interactionId,
  };
}

export function unmuteCall(interactionId) {
  return {
    type: UNMUTE_CALL,
    interactionId,
  };
}

export function holdCall(interactionId) {
  return {
    type: HOLD_CALL,
    interactionId,
  };
}

export function resumeCall(interactionId) {
  return {
    type: RESUME_CALL,
    interactionId,
  };
}

export function recordCall(interactionId) {
  return {
    type: RECORD_CALL,
    interactionId,
  };
}

export function stopRecordCall(interactionId) {
  return {
    type: STOP_RECORD_CALL,
    interactionId,
  };
}

export function emailCreateReply(interactionId) {
  return {
    type: EMAIL_CREATE_REPLY,
    interactionId,
  };
}

export function emailAddAttachment(interactionId, attachment) {
  return {
    type: EMAIL_ADD_ATTACHMENT,
    interactionId,
    attachment,
  };
}

export function emailRemoveAttachment(interactionId, attachmentId) {
  return {
    type: EMAIL_REMOVE_ATTACHMENT,
    interactionId,
    attachmentId,
  };
}

export function emailUpdateReply(interactionId, reply) {
  return {
    type: EMAIL_UPDATE_REPLY,
    interactionId,
    reply,
  };
}

export function emailCancelReply(interactionId) {
  return {
    type: EMAIL_CANCEL_REPLY,
    interactionId,
  };
}

export function emailSendReply(interactionId) {
  return {
    type: EMAIL_SEND_REPLY,
    interactionId,
  };
}

export function updateNote(interactionId, note) {
  return {
    type: UPDATE_NOTE,
    interactionId,
    note,
  };
}

export function updateScriptValues(interactionId, scriptValueMap) {
  return {
    type: UPDATE_SCRIPT_VALUES,
    interactionId,
    scriptValueMap,
  };
}

export function setDispositionDetails(interactionId, dispositions, forceSelect) {
  return {
    type: SET_DISPOSITION_DETAILS,
    interactionId,
    dispositions,
    forceSelect,
  };
}
export function selectDisposition(interactionId, disposition) {
  return {
    type: SELECT_DISPOSITION,
    interactionId,
    disposition,
  };
}

export function showRefreshRequired(show) {
  return {
    type: SHOW_REFRESH_NOTIF,
    show,
  };
}
