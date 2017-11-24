/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS, Map, List } from 'immutable';

import Interaction, {
  activeContactFormBlank,
} from 'models/Interaction/Interaction';
import Message from 'models/Message/Message';
import ResponseMessage from 'models/Message/ResponseMessage';

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
  SET_INTERACTION_STATUS,
  SET_INTERACTION_CONFIRMATION,
  SET_ACTIVE_RESOURCES,
  OPEN_NEW_INTERACTION_PANEL,
  NEW_INTERACTION_PANEL_SELECT_CONTACT,
  CLOSE_NEW_INTERACTION_PANEL,
  CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL,
  SET_NEW_INTERACTION_PANEL_FORM_INPUT,
  START_OUTBOUND_INTERACTION,
  INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP,
  ADD_INTERACTION,
  WORK_INITIATED,
  SET_IS_CANCELLING_INTERACTION,
  REMOVE_INTERACTION,
  REMOVE_INTERACTION_HARD,
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  SET_INTERACTION_QUERY,
  SET_MESSAGE_HISTORY,
  UPDATE_MESSAGE_HISTORY_AGENT_NAME,
  SET_CONTACT_MODE,
  SET_ASSIGNED_CONTACT,
  UNASSIGN_CONTACT,
  DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION,
  DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION,
  SELECT_SIDE_PANEL_TAB,
  SET_CONTACT_INTERACTION_HISTORY,
  SET_CRM_INTERACTION_HISTORY,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS,
  UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS,
  ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY,
  UPDATE_CONTACT,
  SELECT_CONTACT,
  REMOVE_CONTACT,
  ADD_MESSAGE,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  TOGGLE_CUSTOM_FIELDS,
  SET_EMAIL_PLAIN_BODY,
  SET_EMAIL_HTML_BODY,
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
  SET_AGENT_DIRECTION,
  INIT_FORM,
  RESET_FORM,
  SAVE_MESSAGE_STATE,
} from './constants';

// import { outboundConnectingVoiceInteraction, voiceInteraction, voiceInteractionWithTransfersAndScripts, emailInteraction, smsInteractionWithLotsOfMessagesAndScript, smsInteractionWithUnrespondedMessageAndScript, smsInteractionWithUnrespondedMessageAndScript2, smsInteractionWithLotsOfMessagesAndScript2, smsInteractionWithLotsOfMessagesAndScript3, smsInteractionWithLotsOfMessagesAndScript4, smsInteractionWithLotsOfMessagesAndScript5, smsInteractionWithLotsOfMessagesAndScript6, scriptOnly } from './assets/mockInteractions'; // eslint-disable-line no-unused-vars

const blankNewInteractionPanel = {
  interactionId: 'creating-new-interaction',
  status: 'creating-new-interaction',
  visible: false,
  isSidePanelCollapsed: false,
  selectedSidePanelTab: 'info',
  contactMode: 'view',
  query: {},
  activeContactForm: activeContactFormBlank,
  // newInteractionFormInput is used for creating new interactions when the crm is disabled
  newInteractionFormInput: '',
};

const blankCurrentCrmItemHistoryPanel = {
  interactionId: 'current-crm-item-history',
  status: 'current-crm-item-history',
  isSidePanelCollapsed: true,
};

const initialState = fromJS({
  // Uncomment to allow login screen to be hidden
  // presence: 'ready',
  // userConfig: {
  //   messageTemplates: [],
  // },
  interactions: [
    // Un-comment out below (and the above imports) to mock interactions (only use one voice interaction at a time):
    // outboundConnectingVoiceInteraction,
    // voiceInteraction,
    // voiceInteractionWithTransfersAndScripts,
    // emailInteraction,
    // smsInteractionWithLotsOfMessagesAndScript,
    // smsInteractionWithUnrespondedMessageAndScript,
    // smsInteractionWithLotsOfMessagesAndScript2,
    // smsInteractionWithLotsOfMessagesAndScript3,
    // smsInteractionWithLotsOfMessagesAndScript4,
    // smsInteractionWithLotsOfMessagesAndScript5,
    // smsInteractionWithLotsOfMessagesAndScript6,
    // smsInteractionWithUnrespondedMessageAndScript2,
    // scriptOnly,
  ],
  noInteractionContactPanel: {
    contactMode: 'search',
    query: {},
    isSidePanelCollapsed: true,
    selectedSidePanelTab: 'info',
    activeContactForm: activeContactFormBlank,
  },
  newInteractionPanel: blankNewInteractionPanel,
  currentCrmItemHistoryPanel: blankCurrentCrmItemHistoryPanel,
  queues: [],
  extensions: [],
  activeExtension: {},
  refreshRequired: false,
  presenceReasonLists: [],
  presenceReason: {},
  isInteractionsBarCollapsed: true,
  sidePanelPx: 500,
  sidePanelMaxPx: 500,
  agentDirection: { direction: 'inbound' },
});

const getInteractionIndex = (state, interactionId) =>
  state
    .get('interactions')
    .findIndex(
      (interaction) => interaction.get('interactionId') === interactionId
    );

const getSelectedContactInteractionPath = (state) => {
  const interactionIndex = getInteractionIndex(
    state,
    state.get('selectedInteractionId')
  );
  let selectedInteractionPath;
  if (interactionIndex !== -1) {
    selectedInteractionPath = ['interactions', interactionIndex];
  } else if (
    state.get('selectedInteractionId') === 'creating-new-interaction'
  ) {
    selectedInteractionPath = ['newInteractionPanel'];
  } else {
    selectedInteractionPath = ['noInteractionContactPanel'];
  }
  return selectedInteractionPath;
};

const getContactInteractionPath = (state, interactionId) => {
  const interactionIndex = getInteractionIndex(state, interactionId);
  let target;
  if (interactionId === 'creating-new-interaction') {
    target = ['newInteractionPanel'];
  } else if (interactionId === 'current-crm-item-history') {
    target = ['crmActiveTab'];
  } else if (interactionIndex === -1) {
    target = ['noInteractionContactPanel'];
  } else {
    target = ['interactions', interactionIndex];
  }
  return target;
};

const categorizeItems = (rawItems, name) => {
  const categorizedItems = [];
  rawItems.sort((a, b) => a.sortOrder > b.sortOrder).forEach((item) => {
    if (item.hierarchy[0]) {
      const existingCategoryIndex = categorizedItems.findIndex(
        (category) => category.name === item.hierarchy[0]
      );
      if (existingCategoryIndex > -1) {
        categorizedItems[existingCategoryIndex][name].push(item);
      } else {
        categorizedItems.push({
          name: item.hierarchy[0],
          [name]: [item],
          type: 'category',
        });
      }
    } else {
      categorizedItems.push(item);
    }
  });
  return categorizedItems;
};

const addContactInteractionNote = (interaction, action) =>
  interaction.updateIn(
    ['contact', 'interactionHistory'],
    (interactionHistory) => {
      if (typeof interactionHistory === 'undefined') {
        return interactionHistory;
      }
      return interactionHistory.update('results', (results) =>
        results.map((contactHistoryInteraction) => {
          if (
            contactHistoryInteraction.get('interactionId') ===
              action.contactHistoryInteractionId &&
            contactHistoryInteraction.get('interactionDetails') !== undefined
          ) {
            return contactHistoryInteraction.updateIn(
              ['interactionDetails', 'agents'],
              (agents) =>
                agents.map((agent) => {
                  const agentNote = action.response.results.find(
                    (note) => note.resourceId === agent.get('resourceId')
                  );
                  if (agentNote !== undefined) {
                    return agent.set('note', agentNote);
                  } else {
                    return agent;
                  }
                })
            );
          } else {
            return contactHistoryInteraction;
          }
        })
      );
    }
  );

const setContactInteractionDetails = (interaction, action) => {
  if (interaction !== undefined) {
    return interaction.updateIn(
      ['contact', 'interactionHistory'],
      (interactionHistory) => {
        if (typeof interactionHistory === 'undefined') {
          return interactionHistory;
        }
        return interactionHistory.update('results', (interactionHistoryResults) =>
          interactionHistoryResults.map((contactHistoryInteraction) => {
            if (
              contactHistoryInteraction.get('interactionId') ===
              action.response.details.interactionId
            ) {
              return contactHistoryInteraction.set(
                'interactionDetails',
                fromJS(action.response.details)
              );
            } else {
              return contactHistoryInteraction;
            }
          })
        );
      }
    );
  } else {
    return undefined;
  }
};

const updateContactInteractionDetails = (interaction, action) => {
  if (
    interaction !== undefined &&
    interaction.get('contact') !== undefined &&
    interaction.getIn(['contact', 'interactionHistory']) !== undefined &&
    interaction.getIn(['contact', 'interactionHistory', 'results']) !==
      undefined
  ) {
    return interaction.updateIn(
      ['contact', 'interactionHistory', 'results'],
      (interactionHistory) => {
        if (typeof interactionHistory === 'undefined') {
          return interactionHistory;
        }
        return interactionHistory.map((contactHistoryInteraction) => {
          if (
            contactHistoryInteraction.get('interactionId') ===
            action.interactionId
          ) {
            return contactHistoryInteraction.mergeIn(
              ['interactionDetails'],
              fromJS(action.interactionDetails)
            );
          } else {
            return contactHistoryInteraction;
          }
        });
      }
    );
  } else {
    return interaction;
  }
};

const updateContactInteractionHistoryResults = (contact, action) => {
  if (
    contact !== undefined &&
    (contact.get('id') === action.contactId ||
      (contact.get('id') === action.id &&
        contact.get('type') === action.subType))
  ) {
    return contact.update('interactionHistory', (interactionHistory) => {
      if (action.response.results === undefined) {
        return action.response.results;
      } else if (
        interactionHistory === undefined ||
        action.response.page === interactionHistory.get('nextPage')
      ) {
        const existingResults = interactionHistory
          ? interactionHistory.get('results')
          : false;
        let existingEarliestTimestamp;
        if (existingResults) {
          existingEarliestTimestamp = interactionHistory.get(
            'earliestTimestamp'
          );
        }
        const earliestTimestamp =
          existingEarliestTimestamp || action.response.earliestTimestamp;

        // Update results (keys) for crm interactions
        const updatedResults = action.response.results.map((result) => {
          const updatedResult = Object.assign(result, {});
          if (updatedResult.direction !== undefined) {
            updatedResult.directionName =
              updatedResult.direction.charAt(0).toUpperCase() +
              updatedResult.direction.slice(1);
            delete updatedResult.direction;
          }
          if (updatedResult.dispositionName !== undefined) {
            updatedResult.lastDispositionName = updatedResult.dispositionName;
            delete updatedResult.dispositionName;
          }
          if (updatedResult.queues !== undefined) {
            updatedResult.lastQueueName =
              updatedResult.queues[updatedResult.queues.length - 1].queueName;
          }
          return updatedResult;
        });

        return new Map({
          nextPage: action.response.page + 1,
          page: action.response.page,
          total: action.response.total,
          results: existingResults
            ? existingResults.concat(fromJS(updatedResults))
            : fromJS(updatedResults),
          earliestTimestamp,
        });
      } else {
        return interactionHistory;
      }
    });
  } else {
    return contact;
  }
};

const getNextSelectedInteractionId = (state, interactionId) => {
  // If the interaction being removed is the selected interaction, select the next interaction (voice, first non-voice)
  let nextSelectedInteractionId;
  if (state.get('selectedInteractionId') === interactionId) {
    const interactionBeingRemoved = state
      .get('interactions')
      .find((interaction) => interaction.get('interactionId') === interactionId);
    const currentVoiceInteraction = state
      .get('interactions')
      .find(
        (interaction) =>
          interaction.get('channelType') === 'voice' &&
          !['work-offer', 'work-initiated'].includes(interaction.get('status'))
      );
    if (
      interactionBeingRemoved &&
      interactionBeingRemoved.get('channelType') !== 'voice' &&
      currentVoiceInteraction
    ) {
      nextSelectedInteractionId = currentVoiceInteraction.get('interactionId');
    } else {
      const firstNonVoiceInteraction = state
        .get('interactions')
        .find(
          (interaction) =>
            interaction.get('channelType') !== 'voice' &&
            interaction.get('interactionId') !== interactionId &&
            !['work-offer', 'work-initiated'].includes(
              interaction.get('status')
            )
        );
      nextSelectedInteractionId = firstNonVoiceInteraction
        ? firstNonVoiceInteraction.get('interactionId')
        : undefined;
    }
  } else {
    nextSelectedInteractionId = state.get('selectedInteractionId');
  }
  return nextSelectedInteractionId;
};

const removeInteractionAndSetNextSelectedInteraction = (
  state,
  interactionId
) => {
  const nextSelectedInteractionId = getNextSelectedInteractionId(
    state,
    interactionId
  );
  const filteredInteractions = state
    .get('interactions')
    .filterNot(
      (interaction) => interaction.get('interactionId') === interactionId
    );
  // Remove interaction and set next selectedInteractionId
  return state
    .set('interactions', filteredInteractions)
    .set('selectedInteractionId', nextSelectedInteractionId)
    .set('isInteractionsBarCollapsed', filteredInteractions.size === 0);
};

function agentDesktopReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CRM_MODULE:
      return state.set('crmModule', action.crmModule);
    case SET_STANDALONE_POPUP:
      return state.set('standalonePopup', true);
    case SET_CRM_ACTIVE_TAB:
      if (action.tabType === undefined) {
        return state
          .delete('crmActiveTab')
          .set(
            'selectedInteractionId',
            getNextSelectedInteractionId(state, 'current-crm-item-history')
          );
      } else if (
        state.getIn(['crmActiveTab', 'contact', 'id']) !== action.id ||
        state.getIn(['crmActiveTab', 'contact', 'type']) !== action.tabType
      ) {
        return state.set(
          'crmActiveTab',
          fromJS({
            interactionId: 'current-crm-item-history',
            contact: {
              type: action.tabType,
              id: action.id,
              attributes: { name: action.name },
            },
          })
        );
      } else {
        // Don't clear interactionHistory if it is the same. Just update name in case it changed.
        return state.setIn(
          ['crmActiveTab', 'contact', 'attributes', 'name'],
          action.name
        );
      }
    case SET_AGENT_DIRECTION:
      return state.set('agentDirection', fromJS(action.response));
    case SHOW_REFRESH_NOTIF:
      return state.set('refreshRequired', action.show);
    case SET_USER_CONFIG: {
      const presenceReasonLists = action.response.reasonLists.filter(
        (list) => list.active === true
      );
      let newState = state.set('userConfig', fromJS(action.response));
      if (presenceReasonLists) {
        newState = newState.set(
          'presenceReasonLists',
          fromJS(
            presenceReasonLists.map((reasonList) => {
              // eslint-disable-next-line no-param-reassign
              reasonList.reasons = categorizeItems(
                reasonList.reasons,
                'reasons'
              );
              return reasonList;
            })
          )
        );
      }
      return newState;
    }
    case SET_EXTENSIONS:
      return (
        state
          // Set active extension to the first available one if it isn't set
          .set(
            'activeExtension',
            action.response.activeExtension
              ? fromJS(action.response.activeExtension)
              : fromJS(action.response.extensions[0])
          )
          .set('extensions', fromJS(action.response.extensions))
      );
    case SET_ACTIVE_EXTENSION:
      return state.set('activeExtension', fromJS(action.activeExtension));
    case REMOVE_INVALID_EXTENSION: {
      const selectedExtensionValue = state.get('activeExtension').get('value');
      return state.update('extensions', (extensions) =>
        extensions.filter(
          (extension) => extension.get('value') !== selectedExtensionValue
        )
      );
    }
    case SET_QUEUES:
      return state.set('queues', fromJS(action.queues)).set('queuesSet', true);
    case SET_QUEUE_TIME: {
      const queueIndex = state
        .get('queues')
        .findIndex((queue) => queue.get('id') === action.queueId);
      if (queueIndex !== -1) {
        return state.setIn(
          ['queues', queueIndex, 'queueTime'],
          action.queueTime
        );
      } else {
        return state;
      }
    }
    case SET_PRESENCE: {
      const systemPresenceReasonList = state
        .get('presenceReasonLists')
        .find(
          (reasonList) => reasonList.get('name') === 'System Presence Reasons'
        );
      const isSystemReason =
        action.presenceInfo.reasonListId === null ||
        (systemPresenceReasonList &&
          systemPresenceReasonList.get('id') ===
            action.presenceInfo.reasonListId);
      return state.set('presence', action.presenceInfo.state).set(
        'presenceReason',
        fromJS({
          reason: action.presenceInfo.reason,
          reasonId: action.presenceInfo.reasonId,
          listId: action.presenceInfo.reasonListId,
          isSystemReason,
        })
      );
    }
    case SET_INTERACTION_STATUS: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        const automaticallySelectInteraction =
          (action.newStatus === 'work-accepting' ||
            action.newStatus === 'work-accepted') &&
          state.get('selectedInteractionId') === undefined;
        let hideNewInteractionPanelOnWorkAccepted = false;
        let newState = state
          .updateIn(['interactions', interactionIndex], (interaction) => {
            hideNewInteractionPanelOnWorkAccepted = interaction.get(
              'hideNewInteractionPanelOnWorkAccepted'
            );
            let updatedInteraction = interaction.set(
              'status',
              action.newStatus
            );
            if (
              action.newStatus === 'work-accepting' &&
              interaction.get('channelType') === 'voice'
            ) {
              updatedInteraction = updatedInteraction.set(
                'timeAccepted',
                Date.now()
              );
            }
            if (
              interaction.get('channelType') === 'voice' &&
              action.response !== undefined
            ) {
              // Update customerOnHold and recording
              updatedInteraction = updatedInteraction
                .set('onHold', action.response.customerOnHold === true)
                .set('recording', action.response.recording === true);
            }
            if (
              action.newStatus === 'work-accepting' &&
              updatedInteraction.get('isScriptOnly') === true
            ) {
              // Remove isScriptOnly if we are accepting the work offer
              updatedInteraction = updatedInteraction.delete('isScriptOnly');
            }
            return updatedInteraction;
          })
          .set(
            'selectedInteractionId',
            automaticallySelectInteraction
              ? action.interactionId
              : state.get('selectedInteractionId')
          );
        if (
          hideNewInteractionPanelOnWorkAccepted &&
          action.newStatus === 'work-accepting'
        ) {
          // Hide new interaction panel and auto select interaction (for outbound voice from new interaction panel)
          newState = newState
            .set('selectedInteractionId', action.interactionId)
            .set('newInteractionPanel', fromJS(blankNewInteractionPanel));
        }
        if (action.newStatus === 'wrapup') {
          const wrapupTimeout = state.getIn([
            'interactions',
            interactionIndex,
            'wrapupDetails',
            'wrapupTime',
          ]);
          const newTimeout = Date.now() + wrapupTimeout * 1000;
          newState = newState.updateIn(
            ['interactions', interactionIndex],
            (interaction) =>
              interaction
                .set('timeout', newTimeout)
                .set('wrapupStarted', Date.now())
          );
        }
        return newState;
      }
      return state;
    }
    case SET_INTERACTION_CONFIRMATION: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        const newState = state.updateIn(
          ['interactions', interactionIndex],
          (interaction) => {
            const updatedInteraction = interaction.set(
              'endConfirmation',
              action.newStatus
            );
            return updatedInteraction;
          }
        );
        return newState;
      }
      return state;
    }
    case SET_ACTIVE_RESOURCES: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set(
            'warmTransfers',
            new List(
              action.activeResources.map((resource) => {
                const mappedResource = Object.assign({}, resource);
                mappedResource.targetResource = mappedResource.id;
                mappedResource.status = 'connected';
                if (mappedResource.externalResource) {
                  mappedResource.name = mappedResource.extension;
                } else {
                  mappedResource.name = 'Agent';
                }
                mappedResource.addedTimestamp = Date.now();
                return fromJS(mappedResource);
              })
            )
          )
        );
      }
      return state;
    }
    case OPEN_NEW_INTERACTION_PANEL: {
      return state
        .update('newInteractionPanel', (newInteractionPanel) =>
          newInteractionPanel
            .set('newInteractionFormInput', action.optionalInput)
            .set('visible', true)
            .set('isSidePanelCollapsed', action.isSidePanelCollapsed === true)
        )
        .set(
          'selectedInteractionId',
          state.getIn(['newInteractionPanel', 'interactionId'])
        );
    }
    case NEW_INTERACTION_PANEL_SELECT_CONTACT: {
      return state.update('newInteractionPanel', (newInteractionPanel) =>
        newInteractionPanel
          .set('contact', fromJS(action.contact))
          .set('contactMode', 'view')
      );
    }
    case CLOSE_NEW_INTERACTION_PANEL: {
      return state
        .set('newInteractionPanel', fromJS(blankNewInteractionPanel))
        .set(
          'selectedInteractionId',
          getNextSelectedInteractionId(state, 'creating-new-interaction')
        );
    }
    case CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL: {
      return state
        .set(
          'currentCrmItemHistoryPanel',
          fromJS(blankCurrentCrmItemHistoryPanel)
        )
        .set(
          'selectedInteractionId',
          getNextSelectedInteractionId(state, 'current-crm-item-history')
        );
    }
    case SET_NEW_INTERACTION_PANEL_FORM_INPUT: {
      return state.setIn(
        ['newInteractionPanel', 'newInteractionFormInput'],
        action.input
      );
    }
    case START_OUTBOUND_INTERACTION: {
      const outboundInteraction = new Map(
        new Interaction({
          interactionId: action.interactionId,
          channelType: action.channelType,
          customer: action.customer,
          contact: action.contact,
          isSidePanelCollapsed: !action.openSidePanel,
          // We don't want to hide the new interaction panel for outbound voice until the interaction has been accepted because
          // the voice interation is not 'selectable' until then and we want to avoid the contact panel 'flicker' in between
          hideNewInteractionPanelOnWorkAccepted:
            action.addedByNewInteractionPanel && action.channelType === 'voice',
          // initiatedByCurrentAgent so we know if we should render the 'Cancel' button
          initiatedByCurrentAgent:
            action.channelType === 'voice' ? true : undefined,
          direction: 'outbound',
          status: 'connecting-to-outbound',
          contactMode: action.contact !== undefined ? 'view' : 'search',
        })
      );
      return (
        state
          .set(
            'interactions',
            state.get('interactions').push(outboundInteraction)
          )
          // Hide the new interaction panel and auto select new new interaction for SMS
          .set(
            'selectedInteractionId',
            action.channelType === 'sms' || action.channelType === 'email'
              ? outboundInteraction.get('interactionId')
              : state.get('selectedInteractionId')
          )
          .update('newInteractionPanel', (newInteractionPanel) => {
            if (
              (action.channelType === 'sms' ||
                action.channelType === 'email') &&
              action.addedByNewInteractionPanel
            ) {
              return fromJS(blankNewInteractionPanel);
            } else {
              return newInteractionPanel;
            }
          })
      );
    }
    case INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP: {
      const interactionIndex = getInteractionIndex(
        state,
        action.placeholderInteractionId
      );
      return state
        .updateIn(
          ['interactions', interactionIndex],
          (interaction) =>
            interaction
              .set('interactionId', action.interactionId)
              .set('status', 'initialized-outbound')
              .set(
                'messageHistory',
                new List().push(
                  new Message({
                    text: action.message,
                    from: 'Agent',
                    type: 'agent',
                    timestamp: new Date(Date.now()).toISOString(),
                  })
                )
              )
          // Update the selected interactionId to match the new one (if it is selected)
        )
        .set(
          'selectedInteractionId',
          state.get('selectedInteractionId') === action.placeholderInteractionId
            ? action.interactionId
            : state.get('selectedInteractionId')
        );
    }
    case ADD_INTERACTION: {
      // Don't re-add outbound SMS interaction. It was already added by INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP.
      // Don't re-add outbound Email interaction. It was already added by START_OUTBOUND_EMAIL.
      if (
        !(
          action.response.direction === 'outbound' &&
          (action.response.channelType === 'sms' ||
            action.response.channelType === 'email')
        )
      ) {
        // If interaction was already added by START_OUTBOUND_INTERACTION or ADD_SCRIPT, replace it; otherwise, just push it to the list
        const interactionIndex = state
          .get('interactions')
          .findIndex(
            (interaction) =>
              (interaction.get('direction') === 'outbound' &&
                interaction.get('channelType') ===
                  action.response.channelType) ||
              (interaction.get('interactionId') ===
                action.response.interactionId &&
                interaction.get('status') === 'script-only')
          );
        let interactionToAdd = new Map(new Interaction(action.response));
        if (interactionIndex !== -1) {
          // Keep existing contact, contact mode, and side panel collapsed values
          interactionToAdd = interactionToAdd
            .delete('contact')
            .delete('contactMode')
            .delete('isSidePanelCollapsed');
          return state
            .mergeIn(['interactions', interactionIndex], interactionToAdd)
            .set('isInteractionsBarCollapsed', false);
        } else {
          return state
            .set(
              'interactions',
              state.get('interactions').push(interactionToAdd)
            )
            .set('isInteractionsBarCollapsed', false);
        }
      } else {
        return state;
      }
    }
    case UPDATE_WRAPUP_DETAILS: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex > -1) {
        return state.mergeIn(
          ['interactions', interactionIndex, 'wrapupDetails'],
          fromJS(action.wrapupDetails)
        );
      }
      return state;
    }
    case ADD_SCRIPT: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      // Replace useless script id with actual one needed for the SDK
      const script = fromJS(action.script).set('id', action.scriptId);
      if (interactionIndex > -1) {
        return state.setIn(
          ['interactions', interactionIndex, 'script'],
          script
        );
      } else {
        // 'script-only' is the main status we will use. isScriptOnly for when interactions receive a work offer, but still need to render the script in MainContentArea until it has been accepted
        const scriptInteraction = fromJS({
          interactionId: action.interactionId,
          status: 'script-only',
          isScriptOnly: true,
          script,
          isSidePanelCollapsed: true,
          selectedSidePanelTab: 'info',
          query: {},
          activeContactForm: activeContactFormBlank,
        });
        return state
          .update('interactions', (interactions) =>
            interactions.push(scriptInteraction)
          )
          .set(
            'selectedInteractionId',
            state.get('selectedInteractionId') || action.interactionId
          )
          .set('isInteractionsBarCollapsed', false);
      }
    }
    case REMOVE_SCRIPT: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex > -1) {
        const interaction = state.getIn(['interactions', interactionIndex]);
        const interactionStatus = interaction.get('status');
        // Remove the interaction if the script is the only thing to do
        if (
          interactionStatus === 'work-ended-pending-script' ||
          interactionStatus === 'script-only'
        ) {
          return removeInteractionAndSetNextSelectedInteraction(
            state,
            action.interactionId
          );
        } else if (interaction.get('isScriptOnly')) {
          // Case where work is offered in between receiving and sending a script
          return state
            .updateIn(['interactions', interactionIndex], (interactionToUpdate) =>
              interactionToUpdate
                .set('script', undefined)
                .delete('isScriptOnly')
            )
            .set(
              'selectedInteractionId',
              getNextSelectedInteractionId(state, action.interactionId)
            );
        } else {
          return state.setIn(
            ['interactions', interactionIndex, 'script'],
            undefined
          );
        }
      } else {
        return state;
      }
    }
    case WORK_INITIATED: {
      const interactionIndex = getInteractionIndex(
        state,
        action.response.interactionId
      );
      return state.updateIn(['interactions', interactionIndex], (interaction) => {
        let newInteraction = interaction.set('status', 'work-initiated');
        if (interaction.get('channelType') === 'voice') {
          newInteraction = newInteraction.set(
            'number',
            action.response.customer
          );
        } else if (interaction.get('channelType') === 'sms') {
          newInteraction = newInteraction.set(
            'customer',
            `+${action.response.customer}`
          );
        }
        return newInteraction;
      });
    }
    case SET_IS_CANCELLING_INTERACTION: {
      // setting "isCancellingInteraction" flag so that we can give the user
      // instant visual/UI feedback while we wait for the sdk to do its magic
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('isCancellingInteraction', true)
        );
      } else {
        return state;
      }
    }
    case REMOVE_INTERACTION: {
      const interactionToRemove = state
        .get('interactions')
        .find(
          (interaction) =>
            interaction.get('interactionId') === action.interactionId
        );
      if (
        interactionToRemove !== undefined &&
        interactionToRemove.get('script') === undefined
      ) {
        return removeInteractionAndSetNextSelectedInteraction(
          state,
          action.interactionId
        );
        // If the interaction still has a script, set the interaction's state to indicate this so it can be "disabled" until the script is complete
      } else if (
        interactionToRemove !== undefined &&
        interactionToRemove.get('script') !== undefined
      ) {
        const interactionIndex = getInteractionIndex(
          state,
          action.interactionId
        );
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction
            .set('status', 'work-ended-pending-script')
            .set('contactMode', 'view')
        );
      } else {
        return state;
      }
    }
    case REMOVE_INTERACTION_HARD: {
      const interactionIndexToRemove = state
        .get('interactions')
        .findIndex(
          (interaction) =>
            interaction.get('interactionId') === action.interactionId
        );
      if (interactionIndexToRemove !== -1) {
        return removeInteractionAndSetNextSelectedInteraction(
          state,
          action.interactionId
        );
      } else {
        return state;
      }
    }
    case SET_MESSAGE_HISTORY: {
      const messageInteractionIndex = state
        .get('interactions')
        .findIndex(
          (interaction) =>
            interaction.get('interactionId') === action.response[0].to
        );
      if (messageInteractionIndex >= 0) {
        const messageInteraction = state.getIn([
          'interactions',
          messageInteractionIndex,
        ]);
        if (messageInteraction) {
          // Remove any pseudo local outbound messages we have in local state
          let messageHistoryItems = messageInteraction
            .get('messageHistory')
            .filter(
              (messageHistoryItem) => messageHistoryItem.get('id') !== 'no-id'
            );

          // Add messages that are not already in list
          action.response
            .filter(
              (message) =>
                messageHistoryItems.findIndex(
                  (messageHistoryItem) =>
                    messageHistoryItem.get('id') === message.id
                ) === -1
            )
            .forEach((message) => {
              messageHistoryItems = messageHistoryItems.push(
                new ResponseMessage(message)
              );
            });

          return state.updateIn(
            ['interactions', messageInteractionIndex],
            (interaction) =>
              interaction.set('messageHistory', messageHistoryItems)
          );
        } else {
          return state;
        }
      } else {
        console.warn(
          'Interaction history could not get assigned to an interaction. No matching interactionId.'
        );
        return state;
      }
    }
    case UPDATE_MESSAGE_HISTORY_AGENT_NAME: {
      const interactionIndex = state
        .get('interactions')
        .findIndex(
          (interaction) =>
            interaction.get('interactionId') === action.interactionId
        );
      if (interactionIndex >= 0) {
        return state.updateIn(
          ['interactions', interactionIndex, 'messageHistory'],
          (messageHistory) =>
            messageHistory.map((messageHistoryItem) => {
              if (
                messageHistoryItem.get('type') === 'agent' &&
                messageHistoryItem.get('from') === action.user.id
              ) {
                return messageHistoryItem.set(
                  'from',
                  `${action.user.firstName} ${action.user.lastName}`
                );
              } else {
                return messageHistoryItem;
              }
            })
        );
      } else {
        return state;
      }
    }
    case SET_CONTACT_MODE: {
      const targetPath = getContactInteractionPath(state, action.interactionId);
      return state.updateIn(targetPath, (interaction) => {
        // InfoTab is always a view panel when in new interaction mode
        if (
          action.interactionId === 'creating-new-interaction' &&
          action.newMode === 'search'
        ) {
          return interaction.set('contactMode', 'view');
        } else {
          return interaction.set('contactMode', action.newMode);
        }
      });
    }
    case SET_INTERACTION_QUERY: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('query', fromJS(action.query))
        );
      } else {
        return state;
      }
    }
    case ADD_SEARCH_FILTER: {
      const selectedInteractionPath = getSelectedContactInteractionPath(state);
      return state.updateIn(
        [...selectedInteractionPath, 'query'],
        (interaction) => {
          if (action.filterName === 'q') {
            return fromJS({ [action.filterName]: action.value });
          } else {
            return interaction.set(action.filterName, action.value);
          }
        }
      );
    }
    case REMOVE_SEARCH_FILTER: {
      const selectedInteractionPath = getSelectedContactInteractionPath(state);
      const queryPath = [...selectedInteractionPath, 'query'];
      if (action.filterName) {
        return state.updateIn(queryPath, (query) =>
          query.delete(action.filterName)
        );
      } else {
        return state.setIn(queryPath, fromJS({}));
      }
    }
    case SET_ASSIGNED_CONTACT: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) => {
            const updatedInteraction = interaction.set(
              'contact',
              fromJS(action.contact || {})
            );
            if (state.get('crmModule') === 'zendesk') {
              return updatedInteraction
                .set('contactAssignedNotification', 'contactWasAssigned')
                .set('selectedSidePanelTab', 'history');
            } else if (state.get('crmModule').indexOf('salesforce') > -1) {
              return updatedInteraction.set(
                'contactAssignedNotification',
                'contactWasAssigned'
              );
            } else if (action.contact) {
              return updatedInteraction.set('contactMode', 'view');
            }
            return updatedInteraction;
          })
        );
      } else {
        return state;
      }
    }
    case UNASSIGN_CONTACT: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction
            .delete('contact')
            .set('contactAssignedNotification', 'contactWasUnassigned')
            .set('selectedSidePanelTab', 'script')
        );
      } else {
        return state;
      }
    }
    case DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state.getIn([
          'interactions',
          interactionIndex,
          'contactAssignedNotification',
        ]) === 'contactWasAssigned'
      ) {
        return state.setIn(
          ['interactions', interactionIndex, 'contactAssignedNotification'],
          false
        );
      } else {
        return state;
      }
    }
    case DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state.getIn([
          'interactions',
          interactionIndex,
          'contactAssignedNotification',
        ]) === 'contactWasUnassigned'
      ) {
        return state.deleteIn([
          'interactions',
          interactionIndex,
          'contactAssignedNotification',
        ]);
      } else {
        return state;
      }
    }
    case SELECT_SIDE_PANEL_TAB: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('selectedSidePanelTab');
      return state.setIn(target, action.tabName);
    }
    case SET_CONTACT_HISTORY_INTERACTION_DETAILS: {
      return state
        .update('interactions', (interactions) =>
          interactions.map((interaction) =>
            setContactInteractionDetails(interaction, action)
          )
        )
        .update('noInteractionContactPanel', (noInteractionContactPanel) =>
          setContactInteractionDetails(noInteractionContactPanel, action)
        )
        .update('newInteractionPanel', (newInteractionPanel) =>
          setContactInteractionDetails(newInteractionPanel, action)
        )
        .update('crmActiveTab', (crmActiveTab) =>
          setContactInteractionDetails(crmActiveTab, action)
        );
    }
    case SET_CONTACT_INTERACTION_HISTORY: {
      return state
        .update('interactions', (interactions) =>
          interactions.map((interaction) =>
            interaction.update('contact', (contact) =>
              updateContactInteractionHistoryResults(contact, action)
            )
          )
        )
        .updateIn(['noInteractionContactPanel', 'contact'], (contact) =>
          updateContactInteractionHistoryResults(contact, action)
        )
        .updateIn(['newInteractionPanel', 'contact'], (contact) =>
          updateContactInteractionHistoryResults(contact, action)
        );
    }
    case SET_CRM_INTERACTION_HISTORY: {
      return state
        .update('interactions', (interactions) =>
          interactions.map((interaction) =>
            interaction.update('contact', (contact) =>
              updateContactInteractionHistoryResults(contact, action)
            )
          )
        )
        .updateIn(['crmActiveTab', 'contact'], (zendeskActiveTabContact) =>
          updateContactInteractionHistoryResults(
            zendeskActiveTabContact,
            action
          )
        );
    }
    case SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING: {
      const target = getContactInteractionPath(state, action.interactionId);
      return state.updateIn(target, (interaction) => {
        if (
          interaction.getIn(['contact', 'interactionHistory']) !== undefined
        ) {
          return interaction.updateIn(
            ['contact', 'interactionHistory', 'results'],
            (interactionHistoryResults) =>
              interactionHistoryResults.map((contactHistoryInteraction) => {
                if (
                  contactHistoryInteraction.get('interactionId') ===
                  action.contactHistoryInteractionId
                ) {
                  return contactHistoryInteraction.set(
                    'interactionDetails',
                    'loading'
                  );
                } else {
                  return contactHistoryInteraction;
                }
              })
          );
        } else {
          return interaction;
        }
      });
    }
    case UPDATE_CONTACT_HISTORY_INTERACTION_DETAILS: {
      return state
        .update('interactions', (interactions) =>
          interactions.map((interaction) =>
            updateContactInteractionDetails(interaction, action)
          )
        )
        .update('noInteractionContactPanel', (noInteractionContactPanel) =>
          updateContactInteractionDetails(noInteractionContactPanel, action)
        )
        .update('newInteractionPanel', (newInteractionPanel) =>
          updateContactInteractionDetails(newInteractionPanel, action)
        )
        .updateIn(['crmActiveTab'], (newInteractionPanel) =>
          updateContactInteractionDetails(newInteractionPanel, action)
        );
    }
    case ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY: {
      return state
        .update('interactions', (interactions) =>
          interactions.map((interaction) =>
            addContactInteractionNote(interaction, action)
          )
        )
        .update('noInteractionContactPanel', (noInteractionContactPanel) =>
          addContactInteractionNote(noInteractionContactPanel, action)
        )
        .update('newInteractionPanel', (newInteractionPanel) =>
          addContactInteractionNote(newInteractionPanel, action)
        );
    }
    case UPDATE_CONTACT: {
      let newState = state
        .update('interactions', (interactions) =>
          interactions.map((interaction) => {
            if (
              interaction.getIn(['contact', 'id']) ===
                action.updatedContact.id &&
              (action.contactType === undefined ||
                interaction.getIn(['contact', 'type']) === action.contactType)
            ) {
              return interaction.mergeIn(
                ['contact'],
                fromJS(action.updatedContact)
              );
            }
            return interaction;
          })
        )
        .updateIn(['noInteractionContactPanel', 'contact'], (contact) => {
          if (contact && contact.get('id') === action.updatedContact.id) {
            return contact.merge(fromJS(action.updatedContact));
          }
          return contact;
        })
        .updateIn(['newInteractionPanel', 'contact'], (contact) => {
          if (contact && contact.get('id') === action.updatedContact.id) {
            return contact.merge(fromJS(action.updatedContact));
          }
          return contact;
        });
      if (newState.get('crmActiveTab') !== undefined) {
        newState = newState.updateIn(
          ['crmActiveTab', 'contact'],
          (crmActiveTab) => {
            if (
              crmActiveTab.get('id') === action.updatedContact.id &&
              crmActiveTab.get('type') === action.contactType
            ) {
              return crmActiveTab.merge(fromJS(action.updatedContact));
            } else {
              return crmActiveTab;
            }
          }
        );
      }
      return newState;
    }
    case REMOVE_CONTACT: {
      return state
        .update('interactions', (interactions) =>
          interactions.map((interaction) => {
            if (interaction.getIn(['contact', 'id']) === action.contactId) {
              return interaction.delete('contact');
            }
            return interaction;
          })
        )
        .update('noInteractionContactPanel', (noInteractionContactPanel) => {
          if (
            noInteractionContactPanel.getIn(['contact', 'id']) ===
            action.contactId
          ) {
            return noInteractionContactPanel.delete('contact');
          }
          return noInteractionContactPanel;
        })
        .update('newInteractionPanel', (newInteractionPanel) => {
          if (
            newInteractionPanel.getIn(['contact', 'id']) === action.contactId
          ) {
            return newInteractionPanel.delete('contact');
          }
          return newInteractionPanel;
        });
    }
    case ADD_MESSAGE: {
      if (!(action.message instanceof Message)) {
        throw new Error('ADD_MESSAGE message must be of type Message');
      }
      const messageInteractionIndex = state
        .get('interactions')
        .findIndex(
          (interaction) =>
            interaction.get('interactionId') === action.interactionId
        );
      if (messageInteractionIndex !== -1) {
        return state.updateIn(
          ['interactions', messageInteractionIndex, 'messageHistory'],
          (messageHistory) => messageHistory.push(action.message)
        );
      } else {
        return state;
      }
    }
    case SELECT_INTERACTION: {
      if (!action.interactionId) {
        return state.set('selectedInteractionId', undefined);
      }
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 ||
        action.interactionId === 'creating-new-interaction' ||
        action.interactionId === 'current-crm-item-history'
      ) {
        return state.set('selectedInteractionId', action.interactionId);
      } else {
        return state;
      }
    }
    case SET_CUSTOM_FIELDS: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('customFields', action.customFields)
          )
        );
      } else {
        return state;
      }
    }
    case TOGGLE_CUSTOM_FIELDS: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set(
              'customFieldsCollapsed',
              !interaction.get('customFieldsCollapsed')
            )
          )
        );
      } else {
        return state;
      }
    }
    case SET_EMAIL_PLAIN_BODY: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      return state.updateIn(['interactions', interactionIndex], (interaction) =>
        interaction.set('emailPlainBody', action.body)
      );
    }
    case SET_EMAIL_HTML_BODY: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      return state.updateIn(['interactions', interactionIndex], (interaction) =>
        interaction.set('emailHtmlBody', action.body)
      );
    }
    case SET_EMAIL_DETAILS: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      return state.updateIn(['interactions', interactionIndex], (interaction) =>
        interaction.set('emailDetails', fromJS(action.details))
      );
    }
    case SET_EMAIL_ATTACHMENT_URL: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(
          ['interactions', interactionIndex, 'emailDetails', 'attachments'],
          (attachments) =>
            attachments.map((attachment) => {
              if (attachment.get('artifactFileId') === action.artifactFileId) {
                return attachment.set('url', action.url);
              } else {
                return attachment;
              }
            })
        );
      } else {
        return state;
      }
    }
    case START_WARM_TRANSFERRING: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        action.transferringTo !== undefined &&
        action.transferringTo.id !== undefined &&
        action.transferringTo.type !== undefined &&
        action.transferringTo.name !== undefined
      ) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.update('warmTransfers', (warmTransfers) =>
            warmTransfers.push(
              fromJS({
                ...action.transferringTo,
                status: 'transferring',
                addedTimestamp: Date.now(),
              })
            )
          )
        );
      } else {
        return state;
      }
    }
    case TRANSFER_CANCELLED: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(
          ['interactions', interactionIndex],
          (interaction) => {
            const cancellingTransferIndex = interaction
              .get('warmTransfers')
              .findIndex(
                (warmTransfer) => warmTransfer.get('status') === 'transferring'
              );
            if (cancellingTransferIndex !== -1) {
              return interaction.update('warmTransfers', (warmTransfers) =>
                warmTransfers.delete(cancellingTransferIndex)
              );
            } else {
              return interaction;
            }
          }
        );
      } else {
        return state;
      }
    }
    case RESOURCE_ADDED: {
      const interactionIndex = getInteractionIndex(
        state,
        action.response.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(
          ['interactions', interactionIndex],
          (interaction) => {
            const connectingTransferIndex = interaction
              .get('warmTransfers')
              .findIndex(
                (warmTransfer) => warmTransfer.get('status') === 'transferring'
              );
            if (connectingTransferIndex !== -1) {
              return interaction.updateIn(
                ['warmTransfers', connectingTransferIndex],
                (warmTransfer) =>
                  warmTransfer
                    .set('status', 'connected')
                    .set(
                      'targetResource',
                      action.response.extraParams.targetResource
                    )
              );
            } else {
              return interaction.update('warmTransfers', (warmTransfers) =>
                warmTransfers.push(
                  fromJS({
                    targetResource: action.response.extraParams.targetResource,
                    name: action.response.extraParams.displayName,
                    status: 'connected',
                    addedTimestamp: Date.now(),
                  })
                )
              );
            }
          }
        );
      } else {
        return state;
      }
    }
    case UPDATE_RESOURCE_NAME: {
      return state.update('interactions', (interactions) =>
        interactions.map((interaction) => {
          if (
            interaction.get('warmTransfers') !== undefined &&
            interaction.get('warmTransfers').size > 0
          ) {
            return interaction.update('warmTransfers', (warmTransfers) =>
              warmTransfers.map((warmTransfer) => {
                if (
                  warmTransfer.get('id') === action.response.result.id ||
                  warmTransfer.get('targetResource') ===
                    action.response.result.id
                ) {
                  const name =
                    action.response.result.firstName ||
                    action.response.result.lastName
                      ? `${action.response.result.firstName} ${
                        action.response.result.lastName
                      }`
                      : action.response.result.email;
                  return warmTransfer.set('name', name);
                } else {
                  return warmTransfer;
                }
              })
            );
          } else {
            return interaction;
          }
        })
      );
    }
    case UPDATE_RESOURCE_STATUS: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(
          ['interactions', interactionIndex, 'warmTransfers'],
          (warmTransfers) => {
            const resourceToUpdate = warmTransfers.findIndex(
              (warmTransfer) =>
                warmTransfer.get('targetResource') === action.targetResource
            );
            if (resourceToUpdate !== -1) {
              return warmTransfers.update(resourceToUpdate, (warmTransfer) => {
                if (
                  !(
                    action.statusKey === 'onHold' && action.statusValue === true
                  )
                ) {
                  return warmTransfer.set(action.statusKey, action.statusValue);
                } else {
                  // Also set muted to false if resource is being resumed
                  return warmTransfer
                    .set(action.statusKey, action.statusValue)
                    .set('muted', false);
                }
              });
            } else {
              return warmTransfers;
            }
          }
        );
      } else {
        return state;
      }
    }
    case HOLD_ME: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('meOnHold', true)
        );
      } else {
        return state;
      }
    }
    case RESUME_ME: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('meOnHold', false).set('muted', false)
        );
      } else {
        return state;
      }
    }
    case RESOURCE_REMOVED: {
      const interactionIndex = getInteractionIndex(
        state,
        action.response.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(
          ['interactions', interactionIndex, 'warmTransfers'],
          (warmTransfers) => {
            const resourceToRemoveIndex = warmTransfers.findIndex(
              (warmTransfer) =>
                warmTransfer.get('targetResource') ===
                action.response.extraParams.targetResource
            );
            if (resourceToRemoveIndex !== -1) {
              return warmTransfers.delete(resourceToRemoveIndex);
            } else {
              return warmTransfers;
            }
          }
        );
      } else {
        return state;
      }
    }
    case MUTE_CALL: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('muted', true)
          )
        );
      } else {
        return state;
      }
    }
    case UNMUTE_CALL: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('muted', false)
          )
        );
      } else {
        return state;
      }
    }
    case HOLD_CALL: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('onHold', true)
          )
        );
      } else {
        return state;
      }
    }
    case RESUME_CALL: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('onHold', false)
          )
        );
      } else {
        return state;
      }
    }
    case RECORD_CALL: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('recording', true)
          )
        );
      } else {
        return state;
      }
    }
    case STOP_RECORD_CALL: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('recording', false)
          )
        );
      } else {
        return state;
      }
    }
    case EMAIL_CREATE_REPLY: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state
          .get('interactions')
          .get(interactionIndex)
          .get('channelType') === 'email'
      ) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set(
              'emailReply',
              fromJS({
                tos: interaction.get('emailDetails').get('from'),
                ccs: interaction.get('emailDetails').get('cc'),
                bccs: interaction.get('emailDetails').get('bcc'),
                subject: `RE: ${interaction
                  .get('emailDetails')
                  .get('subject')}`,
                attachments: [],
                message: '',
              })
            )
          )
        );
      } else {
        return state;
      }
    }
    case EMAIL_CANCEL_REPLY: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state
          .get('interactions')
          .get(interactionIndex)
          .get('channelType') === 'email'
      ) {
        return state.update('interactions', (interactions) =>
          interactions.update(interactionIndex, (interaction) =>
            interaction.set('emailReply', undefined)
          )
        );
      } else {
        return state;
      }
    }
    case EMAIL_ADD_ATTACHMENT: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state
          .get('interactions')
          .get(interactionIndex)
          .get('channelType') === 'email'
      ) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.updateIn(['emailReply', 'attachments'], (attachments) => {
            if (action.attachment.attachmentId === undefined) {
              return attachments.push(fromJS(action.attachment));
            } else {
              const loadingAttachmentIndex = attachments.findIndex(
                (attachment) => attachment.get('attachmentId') === undefined
              );
              if (loadingAttachmentIndex !== -1) {
                return attachments
                  .remove(loadingAttachmentIndex)
                  .push(fromJS(action.attachment));
              } else {
                return attachments.push(fromJS(action.attachment));
              }
            }
          })
        );
      } else {
        return state;
      }
    }
    case EMAIL_REMOVE_ATTACHMENT: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state
          .get('interactions')
          .get(interactionIndex)
          .get('channelType') === 'email'
      ) {
        return state.updateIn(
          ['interactions', interactionIndex, 'emailReply', 'attachments'],
          (attachments) =>
            attachments.filter(
              (attachment) =>
                attachment.get('attachmentId') !== action.attachmentId
            )
        );
      } else {
        return state;
      }
    }
    case EMAIL_UPDATE_REPLY: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state
          .get('interactions')
          .get(interactionIndex)
          .get('channelType') === 'email'
      ) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction
            .setIn(['emailReply', 'message'], action.reply.message)
            .setIn(['emailReply', 'tos'], new List(action.reply.tos))
            .setIn(['emailReply', 'ccs'], new List(action.reply.ccs))
            .setIn(['emailReply', 'bccs'], new List(action.reply.bccs))
            .setIn(['emailReply', 'subject'], action.reply.subject)
        );
      } else {
        return state;
      }
    }
    case EMAIL_SEND_REPLY: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (
        interactionIndex !== -1 &&
        state
          .get('interactions')
          .get(interactionIndex)
          .get('channelType') === 'email'
      ) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('sendingReply', true)
        );
      } else {
        return state;
      }
    }
    case UPDATE_NOTE: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.mergeIn(
          ['interactions', interactionIndex, 'note'],
          action.note
        );
      } else {
        return state;
      }
    }
    case SAVE_MESSAGE_STATE: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('currentMessage', action.message)
        );
      } else {
        return state;
      }
    }
    case UPDATE_SCRIPT_VALUES: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        return state.updateIn(
          ['interactions', interactionIndex],
          (interaction) => {
            if (interaction.get('script') !== undefined) {
              return interaction.setIn(
                ['script', 'values'],
                action.scriptValueMap
              );
            } else {
              return interaction;
            }
          }
        );
      } else {
        return state;
      }
    }
    case SET_DISPOSITION_DETAILS: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      if (interactionIndex !== -1) {
        const categorizedDispositions = categorizeItems(
          action.dispositions,
          'dispositions'
        );
        return state.setIn(
          ['interactions', interactionIndex, 'dispositionDetails'],
          fromJS({
            forceSelect: action.forceSelect,
            dispositions: categorizedDispositions,
            selected: [],
          })
        );
      } else {
        return state;
      }
    }
    case SELECT_DISPOSITION: {
      const interactionIndex = getInteractionIndex(state, action.interactionId);
      return state.setIn(
        ['interactions', interactionIndex, 'dispositionDetails', 'selected'],
        fromJS(action.disposition ? [action.disposition] : [])
      );
    }
    case SELECT_CONTACT: {
      return state.mergeIn(
        ['noInteractionContactPanel'],
        fromJS({
          contact: action.contact,
          contactMode: 'view',
        })
      );
    }
    case SHOW_SIDE_PANEL: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('isSidePanelCollapsed');
      return state.setIn(target, false);
    }
    case HIDE_SIDE_PANEL: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('isSidePanelCollapsed');
      return state.setIn(target, true);
    }
    case SET_SIDE_PANEL_PX: {
      if (action.sidePanelMaxPx) {
        return state
          .set('sidePanelPx', action.sidePanelPx)
          .set('sidePanelMaxPx', action.sidePanelMaxPx);
      } else {
        return state.set('sidePanelPx', action.sidePanelPx);
      }
    }
    case SHOW_INTERACTIONS_BAR: {
      return state.set('isInteractionsBarCollapsed', false);
    }
    case HIDE_INTERACTIONS_BAR: {
      return state.set('isInteractionsBarCollapsed', true);
    }
    case SET_FORM_IS_DIRTY: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('formIsDirty');
      return state.setIn(target, action.formIsDirty);
    }
    case SET_FORM_VALIDITY: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('formIsValid');
      return state.setIn(target, action.formIsValid);
    }
    case SET_FORM_FIELD: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('contactForm');
      target.push(action.field);
      return state.setIn(target, action.value);
    }
    case SET_FORM_ERROR: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('formErrors');
      target.push(action.field);
      return state.setIn(target, action.error);
    }
    case SET_SHOW_ERROR: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('showErrors');
      target.push(action.field);
      return state.setIn(target, action.error);
    }
    case SET_UNUSED_FIELD: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('unusedFields');
      target.push(action.field);
      return state.setIn(target, action.value);
    }
    case SET_SELECTED_INDEX: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('selectedIndexes');
      target.push(action.field);
      return state.setIn(target, action.index);
    }
    case SET_EDITING_CONTACTS: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('editingContacts');
      return state.setIn(target, fromJS(action.contacts));
    }
    case SET_CONTACT_SAVE_LOADING: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      target.push('saveLoading');
      return state.setIn(target, action.isLoading);
    }
    case INIT_FORM: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      let updatedState = state.setIn(
        [...target, 'contactForm'],
        fromJS(action.contactForm)
      );
      updatedState = updatedState.setIn(
        [...target, 'formErrors'],
        fromJS(action.formErrors)
      );
      updatedState = updatedState.setIn(
        [...target, 'showErrors'],
        fromJS(action.showErrors)
      );
      if (action.unusedFields) {
        updatedState = updatedState.setIn(
          [...target, 'unusedFields'],
          fromJS(action.unusedFields)
        );
      }
      if (action.selectedIndexes) {
        updatedState = updatedState.setIn(
          [...target, 'selectedIndexes'],
          fromJS(action.selectedIndexes)
        );
      }
      return updatedState;
    }
    case RESET_FORM: {
      const target = getContactInteractionPath(state, action.interactionId);
      target.push('activeContactForm');
      return state.setIn(target, fromJS(activeContactFormBlank));
    }
    default:
      return state;
  }
}

export default agentDesktopReducer;
