/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentDesktop actions
 *
 */

import {
  SET_CRM_MODULE,
  SET_STANDALONE_POPUP,
  SET_CRM_ACTIVE_TAB,
  SET_USER_CONFIG,
  SET_EXTENSIONS,
  UPDATE_WRAPUP_DETAILS,
  ADD_SCRIPT,
  REMOVE_SCRIPT,
  SET_ACTIVE_EXTENSION,
  REMOVE_INVALID_EXTENSION,
  SET_QUEUES,
  SET_QUEUE_TIME,
  SET_PRESENCE,
  GO_NOT_READY,
  OPEN_NEW_INTERACTION_PANEL,
  NEW_INTERACTION_PANEL_SELECT_CONTACT,
  CLOSE_NEW_INTERACTION_PANEL,
  CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL,
  SET_NEW_INTERACTION_PANEL_FORM_INPUT,
  START_OUTBOUND_INTERACTION,
  CANCEL_CLICK_TO_DIAL,
  SET_IS_CANCELLING_INTERACTION,
  INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP,
  ADD_INTERACTION,
  WORK_INITIATED,
  SET_INTERACTION_QUERY,
  SET_MESSAGE_HISTORY,
  UPDATE_MESSAGE_HISTORY_AGENT_NAME,
  SET_CONTACT_MODE,
  ASSIGN_CONTACT,
  SET_ASSIGNED_CONTACT,
  UNASSIGN_CONTACT,
  DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION,
  DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION,
  SELECT_SIDE_PANEL_TAB,
  SET_CONTACT_INTERACTION_HISTORY,
  SET_CRM_INTERACTION_HISTORY,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS,
  LOAD_CONTACT_INTERACTION_HISTORY,
  LOAD_CRM_INTERACTION_HISTORY,
  LOAD_HISTORICAL_INTERACTION_BODY,
  UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS,
  ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY,
  UPDATE_CONTACT,
  DELETE_CONTACTS,
  REMOVE_CONTACT,
  ADD_MESSAGE,
  SET_INTERACTION_STATUS,
  SET_INTERACTION_CONFIRMATION,
  SET_ACTIVE_RESOURCES,
  WORK_ACCEPTED,
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  REMOVE_INTERACTION,
  REMOVE_INTERACTION_HARD,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  TOGGLE_CUSTOM_FIELDS,
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
  SHOW_SIDE_PANEL,
  HIDE_SIDE_PANEL,
  SET_SIDE_PANEL_PX,
  SHOW_INTERACTIONS_BAR,
  HIDE_INTERACTIONS_BAR,
  SET_FORM_IS_DIRTY,
  SET_FORM_VALIDITY,
  SET_FORM_FIELD,
  SET_FORM_ERROR,
  SET_SHOW_ERROR,
  SET_UNUSED_FIELD,
  SET_SELECTED_INDEX,
  SET_EDITING_CONTACTS,
  SET_CONTACT_SAVE_LOADING,
  INIT_FORM,
  RESET_FORM,
  SET_AGENT_DIRECTION,
  SAVE_MESSAGE_STATE,
} from './constants';

export function saveMessageState(interactionId, message) {
  return {
    type: SAVE_MESSAGE_STATE,
    interactionId,
    message,
  };
}

export function setCrmModule(crmModule) {
  return {
    type: SET_CRM_MODULE,
    crmModule,
  };
}

export function setStandalonePopup() {
  return {
    type: SET_STANDALONE_POPUP,
  };
}

export function setCrmActiveTab(tabType, id, name) {
  return {
    type: SET_CRM_ACTIVE_TAB,
    tabType,
    id,
    name,
  };
}

export function setUserConfig(response) {
  return {
    type: SET_USER_CONFIG,
    response,
  };
}

export function setAgentDirection(response) {
  return {
    type: SET_AGENT_DIRECTION,
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

export function addScript(interactionId, script, scriptId) {
  return {
    type: ADD_SCRIPT,
    interactionId,
    script,
    scriptId,
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

export function removeInvalidExtension() {
  return {
    type: REMOVE_INVALID_EXTENSION,
  };
}

export function setQueues(queues) {
  return {
    type: SET_QUEUES,
    queues,
  };
}

export function setQueueTime(queueId, queueTime) {
  return {
    type: SET_QUEUE_TIME,
    queueId,
    queueTime,
  };
}

export function setPresence(presenceInfo) {
  return {
    type: SET_PRESENCE,
    presenceInfo,
  };
}

export function goNotReady(reason, listId) {
  return {
    type: GO_NOT_READY,
    reason,
    listId,
  };
}

export function openNewInteractionPanel(
  isSidePanelCollapsed,
  optionalInput = ''
) {
  return {
    type: OPEN_NEW_INTERACTION_PANEL,
    isSidePanelCollapsed,
    optionalInput,
  };
}

export function newInteractionPanelSelectContact(contact) {
  return {
    type: NEW_INTERACTION_PANEL_SELECT_CONTACT,
    contact,
  };
}

export function closeNewInteractionPanel() {
  return {
    type: CLOSE_NEW_INTERACTION_PANEL,
  };
}

export function closeCurrentCrmItemHistoryPanel() {
  return {
    type: CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL,
  };
}

export function setNewInteractionPanelFormInput(input) {
  return {
    type: SET_NEW_INTERACTION_PANEL_FORM_INPUT,
    input,
  };
}

export function startOutboundInteraction(
  channelType,
  customer,
  contact,
  addedByNewInteractionPanel,
  interactionId,
  openSidePanel
) {
  return {
    type: START_OUTBOUND_INTERACTION,
    channelType,
    customer,
    contact,
    addedByNewInteractionPanel,
    interactionId,
    openSidePanel,
  };
}

export function cancelClickToDial(interactionId) {
  return {
    type: CANCEL_CLICK_TO_DIAL,
    interactionId,
  };
}

export function setIsCancellingInteraction(interactionId) {
  return {
    type: SET_IS_CANCELLING_INTERACTION,
    interactionId,
  };
}

export function initializeOutboundSmsForAgentDesktop(
  placeholderInteractionId,
  interactionId,
  message
) {
  return {
    type: INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP,
    placeholderInteractionId,
    interactionId,
    message,
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

export function setContactMode(interactionId, newMode) {
  return {
    type: SET_CONTACT_MODE,
    interactionId,
    newMode,
  };
}

export function setMessageHistory(response) {
  return {
    type: SET_MESSAGE_HISTORY,
    response,
  };
}

export function updateMessageHistoryAgentName(interactionId, user) {
  return {
    type: UPDATE_MESSAGE_HISTORY_AGENT_NAME,
    interactionId,
    user,
  };
}

export function assignContact(interactionId, contact, skipUnassign) {
  return {
    type: ASSIGN_CONTACT,
    interactionId,
    contact,
    skipUnassign,
  };
}

export function setAssignedContact(interactionId, contact) {
  return {
    type: SET_ASSIGNED_CONTACT,
    interactionId,
    contact,
  };
}

export function unassignContact(interactionId) {
  return {
    type: UNASSIGN_CONTACT,
    interactionId,
  };
}

export function dismissContactWasAssignedNotification(interactionId) {
  return {
    type: DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION,
    interactionId,
  };
}

export function dismissContactWasUnassignedNotification(interactionId) {
  return {
    type: DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION,
    interactionId,
  };
}

export function selectSidePanelTab(interactionId, tabName) {
  return {
    type: SELECT_SIDE_PANEL_TAB,
    interactionId,
    tabName,
  };
}

export function setContactInteractionHistory(contactId, response) {
  return {
    type: SET_CONTACT_INTERACTION_HISTORY,
    contactId,
    response,
  };
}

export function setCrmInteractionHistory(subType, id, response) {
  return {
    type: SET_CRM_INTERACTION_HISTORY,
    subType,
    id,
    response,
  };
}

export function setContactHistoryInteractionDetailsLoading(
  interactionId,
  contactHistoryInteractionId
) {
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

export function loadCrmInteractionHistory(subType, id, page) {
  return {
    type: LOAD_CRM_INTERACTION_HISTORY,
    subType,
    id,
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

export function updateContactHistoryInteractionDetails(
  interactionId,
  interactionDetails
) {
  return {
    type: UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS,
    interactionId,
    interactionDetails,
  };
}

export function addNotesToContactInteractionHistory(
  contactHistoryInteractionId,
  response
) {
  return {
    type: ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY,
    contactHistoryInteractionId,
    response,
  };
}

export function updateContact(updatedContact, contactType) {
  return {
    type: UPDATE_CONTACT,
    updatedContact,
    contactType,
  };
}

export function deleteContacts() {
  return {
    type: DELETE_CONTACTS,
  };
}
export function removeContact(contactId) {
  return {
    type: REMOVE_CONTACT,
    contactId,
  };
}

export function selectContact(contact) {
  return {
    type: SELECT_CONTACT,
    contact,
  };
}

export function addMessage(interactionId, message) {
  return {
    type: ADD_MESSAGE,
    interactionId,
    message,
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

export function setInteractionConfirmation(interactionId, newStatus, response) {
  return {
    type: SET_INTERACTION_CONFIRMATION,
    interactionId,
    newStatus,
    response,
  };
}

export function setActiveResources(interactionId, activeResources) {
  return {
    type: SET_ACTIVE_RESOURCES,
    interactionId,
    activeResources,
  };
}

export function workAccepted(interactionId, response) {
  return {
    type: WORK_ACCEPTED,
    interactionId,
    response,
  };
}

export function removeInteraction(interactionId) {
  return {
    type: REMOVE_INTERACTION,
    interactionId,
  };
}

export function removeInteractionHard(interactionId) {
  return {
    type: REMOVE_INTERACTION_HARD,
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

export function toggleCustomFields(interactionId) {
  return {
    type: TOGGLE_CUSTOM_FIELDS,
    interactionId,
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

export function updateResourceStatus(
  interactionId,
  targetResource,
  statusKey,
  statusValue
) {
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

export function setDispositionDetails(
  interactionId,
  dispositions,
  forceSelect
) {
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

export function showSidePanel(interactionId) {
  return {
    type: SHOW_SIDE_PANEL,
    interactionId,
  };
}

export function hideSidePanel(interactionId) {
  return {
    type: HIDE_SIDE_PANEL,
    interactionId,
  };
}

export function setSidePanelPx(sidePanelPx, sidePanelMaxPx) {
  return {
    type: SET_SIDE_PANEL_PX,
    sidePanelPx,
    sidePanelMaxPx,
  };
}

export function showInteractionsBar() {
  return {
    type: SHOW_INTERACTIONS_BAR,
  };
}

export function hideInteractionsBar() {
  return {
    type: HIDE_INTERACTIONS_BAR,
  };
}

export function setFormIsDirty(interactionId, formIsDirty) {
  return {
    type: SET_FORM_IS_DIRTY,
    interactionId,
    formIsDirty,
  };
}

export function setFormValidity(interactionId, formIsValid) {
  return {
    type: SET_FORM_VALIDITY,
    interactionId,
    formIsValid,
  };
}

export function setFormField(interactionId, field, value) {
  return {
    type: SET_FORM_FIELD,
    interactionId,
    field,
    value,
  };
}

export function setFormError(interactionId, field, error) {
  return {
    type: SET_FORM_ERROR,
    interactionId,
    field,
    error,
  };
}

export function setShowError(interactionId, field, error) {
  return {
    type: SET_SHOW_ERROR,
    interactionId,
    field,
    error,
  };
}

export function setUnusedField(interactionId, field, value) {
  return {
    type: SET_UNUSED_FIELD,
    interactionId,
    field,
    value,
  };
}

export function setSelectedIndex(interactionId, field, index) {
  return {
    type: SET_SELECTED_INDEX,
    interactionId,
    field,
    index,
  };
}

export function setEditingContacts(interactionId, contacts) {
  return {
    type: SET_EDITING_CONTACTS,
    interactionId,
    contacts,
  };
}

export function setContactSaveLoading(interactionId, isLoading) {
  return {
    type: SET_CONTACT_SAVE_LOADING,
    interactionId,
    isLoading,
  };
}

export function initForm(
  interactionId,
  contactForm,
  formErrors,
  showErrors,
  unusedFields,
  selectedIndexes
) {
  return {
    type: INIT_FORM,
    interactionId,
    contactForm,
    formErrors,
    showErrors,
    unusedFields,
    selectedIndexes,
  };
}

export function resetForm(interactionId) {
  return {
    type: RESET_FORM,
    interactionId,
  };
}
