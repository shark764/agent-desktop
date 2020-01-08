/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentDesktop ACTIONS
 *
 */

import * as ACTIONS from './constants';

export function saveMessageState(
  interactionId,
  message,
  messageTemplateFilter,
  messageTemplateIndex
) {
  return {
    type: ACTIONS.SAVE_MESSAGE_STATE,
    interactionId,
    message,
    messageTemplateFilter,
    messageTemplateIndex,
  };
}

export function setMessageTemplateFilter(interactionId) {
  return {
    type: ACTIONS.SET_MESSAGE_TEMPLATE_FILTER,
    interactionId,
  };
}

export function setMessageTemplateIndex(interactionId, messageTemplateIndex) {
  return {
    type: ACTIONS.SET_MESSAGE_TEMPLATE_INDEX,
    interactionId,
    messageTemplateIndex,
  };
}

export function setCrmModule(crmModule) {
  return {
    type: ACTIONS.SET_CRM_MODULE,
    crmModule,
  };
}

export function crmDownloadComplete() {
  return {
    type: ACTIONS.CRM_DOWNLOAD_COMPLETE,
  };
}

export function setStandalonePopup() {
  return {
    type: ACTIONS.SET_STANDALONE_POPUP,
  };
}

export function setCrmActiveTab(tabType, id, name) {
  return {
    type: ACTIONS.SET_CRM_ACTIVE_TAB,
    tabType,
    id,
    name,
  };
}

export function setUserConfig(response) {
  return {
    type: ACTIONS.SET_USER_CONFIG,
    response,
  };
}

export function setAgentDirection(response) {
  return {
    type: ACTIONS.SET_AGENT_DIRECTION,
    response,
  };
}

export function dismissAgentDirection() {
  return {
    type: ACTIONS.DISMISS_AGENT_DIRECTION,
  };
}

export function setExtensions(response) {
  return {
    type: ACTIONS.SET_EXTENSIONS,
    response,
  };
}

export function updateWrapupDetails(interactionId, wrapupDetails) {
  return {
    type: ACTIONS.UPDATE_WRAPUP_DETAILS,
    interactionId,
    wrapupDetails,
  };
}

export function addScript(interactionId, script, scriptId) {
  return {
    type: ACTIONS.ADD_SCRIPT,
    interactionId,
    script,
    scriptId,
  };
}

export function removeScript(interactionId) {
  return {
    type: ACTIONS.REMOVE_SCRIPT,
    interactionId,
  };
}

export function setActiveExtension(activeExtension) {
  return {
    type: ACTIONS.SET_ACTIVE_EXTENSION,
    activeExtension,
  };
}

export function removeInvalidExtension() {
  return {
    type: ACTIONS.REMOVE_INVALID_EXTENSION,
  };
}

export function setQueues(queues) {
  return {
    type: ACTIONS.SET_QUEUES,
    queues,
  };
}

export function setQueuesTime(queueData) {
  return {
    type: ACTIONS.SET_QUEUES_TIME,
    queueData,
  };
}

export function clearQueuesTime(queues) {
  return {
    type: ACTIONS.CLEAR_QUEUES_TIME,
    queues,
  };
}

export function setPresence(presenceInfo) {
  return {
    type: ACTIONS.SET_PRESENCE,
    presenceInfo,
  };
}

export function dismissAgentPresenceState() {
  return {
    type: ACTIONS.DISMISS_AGENT_PRESENCE_STATE,
  };
}

export function goNotReady(reason, listId) {
  return {
    type: ACTIONS.GO_NOT_READY,
    reason,
    listId,
  };
}

export function openNewInteractionPanel(
  isSidePanelCollapsed,
  optionalInput = '',
  popUri,
  objectName
) {
  return {
    type: ACTIONS.OPEN_NEW_INTERACTION_PANEL,
    isSidePanelCollapsed,
    optionalInput,
    popUri,
    objectName,
  };
}

export function newInteractionPanelSelectContact(contact) {
  return {
    type: ACTIONS.NEW_INTERACTION_PANEL_SELECT_CONTACT,
    contact,
  };
}

export function closeNewInteractionPanel() {
  return {
    type: ACTIONS.CLOSE_NEW_INTERACTION_PANEL,
  };
}

export function closeCurrentCrmItemHistoryPanel() {
  return {
    type: ACTIONS.CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL,
  };
}

export function setNewInteractionPanelFormInput(input) {
  return {
    type: ACTIONS.SET_NEW_INTERACTION_PANEL_FORM_INPUT,
    input,
  };
}

export function startOutboundInteraction(outboundInteractionData) {
  return {
    type: ACTIONS.START_OUTBOUND_INTERACTION,
    outboundInteractionData,
  };
}

export function cancelClickToDial(interactionId) {
  return {
    type: ACTIONS.CANCEL_CLICK_TO_DIAL,
    interactionId,
  };
}

export function setIsCancellingInteraction(interactionId) {
  return {
    type: ACTIONS.SET_IS_CANCELLING_INTERACTION,
    interactionId,
  };
}

export function initializeOutboundSmsForAgentDesktop(
  placeholderInteractionId,
  interactionId,
  message
) {
  return {
    type: ACTIONS.INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP,
    placeholderInteractionId,
    interactionId,
    message,
  };
}

export function addInteraction(response) {
  return {
    type: ACTIONS.ADD_INTERACTION,
    response,
  };
}

export function workInitiated(response) {
  return {
    type: ACTIONS.WORK_INITIATED,
    response,
  };
}
export function setInteractionQuery(interactionId, query) {
  return {
    type: ACTIONS.SET_INTERACTION_QUERY,
    interactionId,
    query,
  };
}
export function toggleInteractionNotification(interactionId, notification) {
  return {
    type: ACTIONS.TOGGLE_INTERACTION_NOTIFICATION,
    interactionId,
    notification,
  };
}
export function addSearchFilter(filterName, value) {
  return {
    type: ACTIONS.ADD_SEARCH_FILTER,
    filterName,
    value,
  };
}
export function removeSearchFilter(filterName) {
  return {
    type: ACTIONS.REMOVE_SEARCH_FILTER,
    filterName,
  };
}

export function setContactMode(interactionId, newMode) {
  return {
    type: ACTIONS.SET_CONTACT_MODE,
    interactionId,
    newMode,
  };
}

export function setSmoochMessageHistory(response) {
  return {
    type: ACTIONS.SET_SMOOCH_MESSAGE_HISTORY,
    response,
  };
}

export function addSmoochMessage(interactionId, message) {
  return {
    type: ACTIONS.ADD_SMOOCH_MESSAGE,
    interactionId,
    message,
  };
}

export function setCustomerTyping(interactionId, typing) {
  return {
    type: ACTIONS.SET_CUSTOMER_TYPING,
    interactionId,
    typing,
  };
}

export function setCustomerRead(interactionId, read) {
  return {
    type: ACTIONS.SET_CUSTOMER_READ,
    interactionId,
    read,
  };
}

export function setConversationIsUnread(interactionId, isUnread) {
  return {
    type: ACTIONS.SET_CONVERSATION_IS_UNREAD,
    interactionId,
    isUnread,
  };
}

export function setMessageHistory(response) {
  return {
    type: ACTIONS.SET_MESSAGE_HISTORY,
    response,
  };
}

export function updateMessageHistoryAgentName(interactionId, user) {
  return {
    type: ACTIONS.UPDATE_MESSAGE_HISTORY_AGENT_NAME,
    interactionId,
    user,
  };
}

export function assignContact(interactionId, contact, skipUnassign) {
  return {
    type: ACTIONS.ASSIGN_CONTACT,
    interactionId,
    contact,
    skipUnassign,
  };
}

export function setAssignedContact(interactionId, contact) {
  return {
    type: ACTIONS.SET_ASSIGNED_CONTACT,
    interactionId,
    contact,
  };
}

export function unassignContact(interactionId) {
  return {
    type: ACTIONS.UNASSIGN_CONTACT,
    interactionId,
  };
}

export function dismissContactWasAssignedNotification(interactionId) {
  return {
    type: ACTIONS.DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION,
    interactionId,
  };
}

export function dismissContactWasUnassignedNotification(interactionId) {
  return {
    type: ACTIONS.DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION,
    interactionId,
  };
}

export function selectSidePanelTab(interactionId, tabName) {
  return {
    type: ACTIONS.SELECT_SIDE_PANEL_TAB,
    interactionId,
    tabName,
  };
}

export function setContactInteractionHistory(contactId, response) {
  return {
    type: ACTIONS.SET_CONTACT_INTERACTION_HISTORY,
    contactId,
    response,
  };
}

export function setCrmInteractionHistory(subType, id, response) {
  return {
    type: ACTIONS.SET_CRM_INTERACTION_HISTORY,
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
    type: ACTIONS.SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING,
    interactionId,
    contactHistoryInteractionId,
  };
}

export function setContactHistoryInteractionDetails(response) {
  return {
    type: ACTIONS.SET_CONTACT_HISTORY_INTERACTION_DETAILS,
    response,
  };
}

export function loadContactInteractionHistory(contactId, page) {
  return {
    type: ACTIONS.LOAD_CONTACT_INTERACTION_HISTORY,
    contactId,
    page,
  };
}

export function loadCrmInteractionHistory(subType, id, page) {
  return {
    type: ACTIONS.LOAD_CRM_INTERACTION_HISTORY,
    subType,
    id,
    page,
  };
}

export function loadHistoricalInteractionBody(interactionId, bodyType) {
  return {
    type: ACTIONS.LOAD_HISTORICAL_INTERACTION_BODY,
    interactionId,
    bodyType,
  };
}

export function updateContactHistoryInteractionDetails(
  interactionId,
  interactionDetails
) {
  return {
    type: ACTIONS.UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS,
    interactionId,
    interactionDetails,
  };
}

export function addNotesToContactInteractionHistory(
  contactHistoryInteractionId,
  response
) {
  return {
    type: ACTIONS.ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY,
    contactHistoryInteractionId,
    response,
  };
}

export function updateContact(updatedContact, contactType) {
  return {
    type: ACTIONS.UPDATE_CONTACT,
    updatedContact,
    contactType,
  };
}

export function deleteContacts() {
  return {
    type: ACTIONS.DELETE_CONTACTS,
  };
}
export function removeContact(contactId) {
  return {
    type: ACTIONS.REMOVE_CONTACT,
    contactId,
  };
}

export function selectContact(contact) {
  return {
    type: ACTIONS.SELECT_CONTACT,
    contact,
  };
}

export function addMessage(interactionId, message) {
  return {
    type: ACTIONS.ADD_MESSAGE,
    interactionId,
    message,
  };
}

export function setInteractionStatus(interactionId, newStatus, response) {
  return {
    type: ACTIONS.SET_INTERACTION_STATUS,
    interactionId,
    newStatus,
    response,
  };
}

export function setInteractionConfirmation(interactionId, newStatus, response) {
  return {
    type: ACTIONS.SET_INTERACTION_CONFIRMATION,
    interactionId,
    newStatus,
    response,
  };
}

export function setActiveResources(interactionId, activeResources) {
  return {
    type: ACTIONS.SET_ACTIVE_RESOURCES,
    interactionId,
    activeResources,
  };
}

export function workAccepted(interactionId, response) {
  return {
    type: ACTIONS.WORK_ACCEPTED,
    interactionId,
    response,
  };
}

export function removeInteraction(interactionId) {
  return {
    type: ACTIONS.REMOVE_INTERACTION,
    interactionId,
  };
}

export function removeInteractionHard(interactionId) {
  return {
    type: ACTIONS.REMOVE_INTERACTION_HARD,
    interactionId,
  };
}

export function selectInteraction(interactionId) {
  return {
    type: ACTIONS.SELECT_INTERACTION,
    interactionId,
  };
}

export function setCustomFields(interactionId, customFields) {
  return {
    type: ACTIONS.SET_CUSTOM_FIELDS,
    interactionId,
    customFields,
  };
}

export function toggleCustomFields(interactionId) {
  return {
    type: ACTIONS.TOGGLE_CUSTOM_FIELDS,
    interactionId,
  };
}

export function setEmailPlainBody(interactionId, body) {
  return {
    type: ACTIONS.SET_EMAIL_PLAIN_BODY,
    interactionId,
    body,
  };
}

export function setEmailHtmlBody(interactionId, body) {
  return {
    type: ACTIONS.SET_EMAIL_HTML_BODY,
    interactionId,
    body,
  };
}

export function setEmailDetails(interactionId, details) {
  return {
    type: ACTIONS.SET_EMAIL_DETAILS,
    interactionId,
    details,
  };
}

export function setEmailAttachmentUrl(interactionId, artifactFileId, url) {
  return {
    type: ACTIONS.SET_EMAIL_ATTACHMENT_URL,
    interactionId,
    artifactFileId,
    url,
  };
}

export function setEmailAttachmentFetchingUrl(
  interactionId,
  artifactFileId,
  fetchingAttachmentUrl
) {
  return {
    type: ACTIONS.SET_EMAIL_ATTACHMENT_FETCHING_URL,
    interactionId,
    artifactFileId,
    fetchingAttachmentUrl,
  };
}

export function addEmailToList(interactionId, email, list, input) {
  return {
    type: ACTIONS.ADD_EMAIL_TO_LIST,
    interactionId,
    email,
    list,
    input,
  };
}

export function updateEmailInput(interactionId, input, value) {
  return {
    type: ACTIONS.UPDATE_EMAIL_INPUT,
    interactionId,
    input,
    value,
  };
}

export function updateSelectedEmailTemplate(interactionId, selectedTemplate) {
  return {
    type: ACTIONS.UPDATE_SELECTED_EMAIL_TEMPLATE,
    interactionId,
    selectedTemplate,
  };
}

export function removeEmailFromList(interactionId, index, list) {
  return {
    type: ACTIONS.REMOVE_EMAIL_FROM_LIST,
    interactionId,
    index,
    list,
  };
}

export function startWarmTransferring(interactionId, transferringTo) {
  return {
    type: ACTIONS.START_WARM_TRANSFERRING,
    interactionId,
    transferringTo,
  };
}

export function transferCancelled(interactionId) {
  return {
    type: ACTIONS.TRANSFER_CANCELLED,
    interactionId,
  };
}

export function resourceAdded(response) {
  return {
    type: ACTIONS.RESOURCE_ADDED,
    response,
  };
}

export function updateResourceName(
  interactionId,
  activeResourceId,
  activeResourceName
) {
  return {
    type: ACTIONS.UPDATE_RESOURCE_NAME,
    interactionId,
    activeResourceId,
    activeResourceName,
  };
}

export function updateResourceStatus(
  interactionId,
  targetResource,
  statusKey,
  statusValue
) {
  return {
    type: ACTIONS.UPDATE_RESOURCE_STATUS,
    interactionId,
    targetResource,
    statusKey,
    statusValue,
  };
}

export function holdMe(interactionId) {
  return {
    type: ACTIONS.HOLD_ME,
    interactionId,
  };
}

export function resumeMe(interactionId) {
  return {
    type: ACTIONS.RESUME_ME,
    interactionId,
  };
}

export function resourceRemoved(response) {
  return {
    type: ACTIONS.RESOURCE_REMOVED,
    response,
  };
}

export function updateCallControls(interactionId, callControls) {
  return {
    type: ACTIONS.UPDATE_CALL_CONTROLS,
    interactionId,
    callControls,
  };
}

export function toggleInteractionIsMuting(interactionId, isMuting) {
  return {
    type: ACTIONS.TOGGLE_IS_MUTING,
    interactionId,
    isMuting,
  };
}

export function muteCall(interactionId) {
  return {
    type: ACTIONS.MUTE_CALL,
    interactionId,
  };
}

export function unmuteCall(interactionId) {
  return {
    type: ACTIONS.UNMUTE_CALL,
    interactionId,
  };
}

export function toggleInteractionIsHolding(interactionId, isHolding) {
  return {
    type: ACTIONS.TOGGLE_IS_HOLDING,
    interactionId,
    isHolding,
  };
}

export function holdCall(interactionId) {
  return {
    type: ACTIONS.HOLD_CALL,
    interactionId,
  };
}

export function resumeCall(interactionId) {
  return {
    type: ACTIONS.RESUME_CALL,
    interactionId,
  };
}

export function recordCall(interactionId) {
  return {
    type: ACTIONS.RECORD_CALL,
    interactionId,
  };
}

export function stopRecordCall(interactionId) {
  return {
    type: ACTIONS.STOP_RECORD_CALL,
    interactionId,
  };
}

export function outboundCustomerConnected(interactionId) {
  return {
    type: ACTIONS.OUTBOUND_CUSTOMER_CONNECTED,
    interactionId,
  };
}

export function emailCreateReply(interactionId) {
  return {
    type: ACTIONS.EMAIL_CREATE_REPLY,
    interactionId,
  };
}

export function emailCanSendReply(interactionId) {
  return {
    type: ACTIONS.EMAIL_CAN_SEND_REPLY,
    interactionId,
  };
}

export function emailAddAttachment(interactionId, attachment) {
  return {
    type: ACTIONS.EMAIL_ADD_ATTACHMENT,
    interactionId,
    attachment,
  };
}

export function emailRemoveAttachment(interactionId, attachmentId) {
  return {
    type: ACTIONS.EMAIL_REMOVE_ATTACHMENT,
    interactionId,
    attachmentId,
  };
}

export function emailUpdateReply(interactionId, message) {
  return {
    type: ACTIONS.EMAIL_UPDATE_REPLY,
    interactionId,
    message,
  };
}

export function emailCancelReply(interactionId) {
  return {
    type: ACTIONS.EMAIL_CANCEL_REPLY,
    interactionId,
  };
}

export function emailSendReply(interactionId) {
  return {
    type: ACTIONS.EMAIL_SEND_REPLY,
    interactionId,
  };
}

export function updateNote(interactionId, note) {
  return {
    type: ACTIONS.UPDATE_NOTE,
    interactionId,
    note,
  };
}

export function updateScriptValue(interactionId, elementName, newValue) {
  return {
    type: ACTIONS.UPDATE_SCRIPT_VALUE,
    interactionId,
    elementName,
    newValue,
  };
}

export function updateScriptScrollPosition(interactionId, scrollPosition) {
  return {
    type: ACTIONS.UPDATE_SCRIPT_SCROLL_POSITION,
    interactionId,
    scrollPosition,
  };
}

export function setDispositionDetails(
  interactionId,
  dispositions,
  forceSelect
) {
  return {
    type: ACTIONS.SET_DISPOSITION_DETAILS,
    interactionId,
    dispositions,
    forceSelect,
  };
}

export function selectDisposition(interactionId, disposition) {
  return {
    type: ACTIONS.SELECT_DISPOSITION,
    interactionId,
    disposition,
  };
}

export function showRefreshRequired(show) {
  return {
    type: ACTIONS.SHOW_REFRESH_NOTIF,
    show,
  };
}

export function showSidePanel(interactionId) {
  return {
    type: ACTIONS.SHOW_SIDE_PANEL,
    interactionId,
  };
}

export function hideSidePanel(interactionId) {
  return {
    type: ACTIONS.HIDE_SIDE_PANEL,
    interactionId,
  };
}

export function setSidePanelPx(sidePanelPx, sidePanelMaxPx) {
  return {
    type: ACTIONS.SET_SIDE_PANEL_PX,
    sidePanelPx,
    sidePanelMaxPx,
  };
}

export function showInteractionsBar() {
  return {
    type: ACTIONS.SHOW_INTERACTIONS_BAR,
  };
}

export function hideInteractionsBar() {
  return {
    type: ACTIONS.HIDE_INTERACTIONS_BAR,
  };
}

export function setFormIsDirty(interactionId, formIsDirty) {
  return {
    type: ACTIONS.SET_FORM_IS_DIRTY,
    interactionId,
    formIsDirty,
  };
}

export function setFormValidity(interactionId, formIsValid) {
  return {
    type: ACTIONS.SET_FORM_VALIDITY,
    interactionId,
    formIsValid,
  };
}

export function setFormField(interactionId, field, value) {
  return {
    type: ACTIONS.SET_FORM_FIELD,
    interactionId,
    field,
    value,
  };
}

export function setFormError(interactionId, field, error) {
  return {
    type: ACTIONS.SET_FORM_ERROR,
    interactionId,
    field,
    error,
  };
}

export function setShowError(interactionId, field, error) {
  return {
    type: ACTIONS.SET_SHOW_ERROR,
    interactionId,
    field,
    error,
  };
}

export function setUnusedField(interactionId, field, value) {
  return {
    type: ACTIONS.SET_UNUSED_FIELD,
    interactionId,
    field,
    value,
  };
}

export function setSelectedIndex(interactionId, field, index) {
  return {
    type: ACTIONS.SET_SELECTED_INDEX,
    interactionId,
    field,
    index,
  };
}

export function setEditingContacts(interactionId, contacts) {
  return {
    type: ACTIONS.SET_EDITING_CONTACTS,
    interactionId,
    contacts,
  };
}

export function setContactSaveLoading(interactionId, isLoading) {
  return {
    type: ACTIONS.SET_CONTACT_SAVE_LOADING,
    interactionId,
    isLoading,
  };
}

export function showConfirmationPopupGoReady(popupConfig) {
  return {
    type: ACTIONS.SHOW_CONFIRMATION_POPUP_GO_READY,
    popupConfig,
  };
}

export function showLoginPopup(popupConfig) {
  return {
    type: ACTIONS.SHOW_LOGIN_POPUP,
    popupConfig,
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
    type: ACTIONS.INIT_FORM,
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
    type: ACTIONS.RESET_FORM,
    interactionId,
  };
}

export function toggleTranscriptCopied(interactionId, isCopied) {
  return {
    type: ACTIONS.TOGGLE_TRANSCRIPT_COPIED,
    interactionId,
    isCopied,
  };
}

export function toggleInteractionIsEnding(interactionId, isEnding) {
  return {
    type: ACTIONS.TOGGLE_INTERACTION_IS_ENDING,
    interactionId,
    isEnding,
  };
}

export function toggleIsRecording(interactionId, isRecording) {
  return {
    type: ACTIONS.TOGGLE_IS_RECORDING,
    interactionId,
    isRecording,
  };
}

export function toggleIsOnline(isOnline) {
  return {
    type: ACTIONS.TOGGLE_IS_ONLINE,
    isOnline,
  };
}

export function setIsColdTransferring(interactionId, isColdTransferring) {
  return {
    type: ACTIONS.SET_IS_COLD_TRANSFERRING,
    interactionId,
    isColdTransferring,
  };
}

export function setTranferringInConference(
  interactionId,
  transferringInConference
) {
  return {
    type: ACTIONS.SET_TRANSFERRING_IN_CONFERENCE,
    interactionId,
    transferringInConference,
  };
}

export function setTransferListsFromFlow(interactionId, transferListsFromFlow) {
  return {
    type: ACTIONS.SET_TRANSFER_LISTS_FROM_FLOW,
    interactionId,
    transferListsFromFlow,
  };
}

export function setInteractionTransferLists(
  interactionId,
  interactionTransferLists
) {
  return {
    type: ACTIONS.SET_INTERACTION_TRANSFER_LISTS,
    interactionId,
    interactionTransferLists,
  };
}

export function setInteractionTransferListsLoadingState(
  interactionId,
  isLoading
) {
  return {
    type: ACTIONS.SET_INTERACTION_TRANSFER_LISTS_LOADING_STATE,
    interactionId,
    isLoading,
  };
}

export function setInteractionTransferListsVisibleState(
  interactionTransferListsVisibleState
) {
  return {
    type: ACTIONS.SET_INTERACTION_TRANSFER_LISTS_VISIBLE_STATE,
    interactionTransferListsVisibleState,
  };
}

export function setVisibleStateOfAllInteractionTransferLists(
  visibleStateofAllInteractionTrasferLists
) {
  return {
    type: ACTIONS.SET_VISIBLE_STATE_OF_ALL_INTERACTION_TRANSFER_LISTS,
    visibleStateofAllInteractionTrasferLists,
  };
}

// Saga Actions:

export function updateInteractionTransferLists(channelType) {
  return {
    type: ACTIONS.UPDATE_INTERACTION_TRANSFER_LISTS_$,
    channelType,
  };
}

export function updateInteractionTransferListsVisibleState(transferListId) {
  return {
    type: ACTIONS.UPDATE_INTERACTION_TRANSFER_LIST_VISIBLE_STATE_$,
    transferListId,
  };
}

export function updateVisibleStateOfAllInteractionTransferlists() {
  return {
    type: ACTIONS.UPDATE_VISIBLE_STATE_OF_ALL_INTERACTION_TRANSFER_LISTS_$,
  };
}
