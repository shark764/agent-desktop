/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS, Map, List } from 'immutable';

import Interaction from 'models/Interaction/Interaction';
import Message from 'models/Message/Message';
import ResponseMessage from 'models/Message/ResponseMessage';

import {
  SET_USER_CONFIG,
  SET_EXTENSIONS,
  UPDATE_WRAPUP_DETAILS,
  ADD_SCRIPT,
  REMOVE_SCRIPT,
  SET_ACTIVE_EXTENSION,
  SET_QUEUES,
  SET_PRESENCE,
  SET_INTERACTION_STATUS,
  START_OUTBOUND_INTERACTION,
  INITIALIZE_OUTBOUND_SMS,
  ADD_INTERACTION,
  WORK_INITIATED,
  REMOVE_INTERACTION,
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  SET_INTERACTION_QUERY,
  SET_MESSAGE_HISTORY,
  SET_CONTACT_ACTION,
  ASSIGN_CONTACT,
  SET_SIDE_PANEL_TAB_INDEX,
  SET_CONTACT_INTERACTION_HISTORY,
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
} from './constants';

// import { outboundConnectingVoiceInteraction, voiceInteractionWithTransfersAndScripts, emailInteraction, smsInteractionWithLotsOfMessagesAndScript, smsInteractionWithLotsOfMessagesAndScript2 } from './assets/mockInteractions'; // eslint-disable-line no-unused-vars

const initialState = fromJS({
  // Uncomment to allow login screen to be hidden
  // presence: 'notReady',
  interactions: [
    // Un-comment out below (and the above imports) to mock interactions (only use one voice interaction at a time):
    // outboundConnectingVoiceInteraction,
    // voiceInteractionWithTransfersAndScripts,
    // emailInteraction,
    // smsInteractionWithLotsOfMessagesAndScript,
    // smsInteractionWithLotsOfMessagesAndScript2,
  ],
  noInteractionContactPanel: {
    contactAction: 'search',
    query: {},
    sidePanelTabIndex: 0,
  },
  queues: [],
  extensions: [],
  activeExtension: {},
  refreshRequired: false,
  presenceReasonLists: [],
  presenceReason: {},
});

const categorizeItems = (rawItems, name) => {
  const categorizedItems = [];
  rawItems.sort((a, b) => a.sortOrder > b.sortOrder).forEach(
    (item) => {
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
    }
  );
  return categorizedItems;
};

const addContactInteractionNote = (interaction, action) =>
  interaction.updateIn(['contact', 'interactionHistory'], (interactionHistory) => {
    if (typeof interactionHistory === 'undefined') {
      return interactionHistory;
    }
    return interactionHistory.update('results', (results) => results.map((contactHistoryInteraction) => {
      if (contactHistoryInteraction.get('interactionId') === action.contactHistoryInteractionId && contactHistoryInteraction.get('interactionDetails') !== undefined) {
        return contactHistoryInteraction.updateIn(['interactionDetails', 'agents'], (agents) =>
          agents.map((agent) => {
            const agentNote = action.response.results.find((note) => note.resourceId === agent.get('resourceId'));
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
    }));
  });

const setContactInteractionDetails = (interaction, action) =>
  interaction.updateIn(['contact', 'interactionHistory'], (interactionHistory) => {
    if (typeof interactionHistory === 'undefined') {
      return interactionHistory;
    }
    return interactionHistory.update('results', (interactionHistoryResults) =>
      interactionHistoryResults.map((contactHistoryInteraction) => {
        if (contactHistoryInteraction.get('interactionId') === action.response.details.interactionId) {
          return contactHistoryInteraction.set('interactionDetails', fromJS(action.response.details));
        } else {
          return contactHistoryInteraction;
        }
      })
    );
  });

const updateContactInteractionDetails = (interaction, action) =>
  interaction.updateIn(['contact', 'interactionHistory', 'results'], (interactionHistory) => {
    if (typeof interactionHistory === 'undefined') {
      return interactionHistory;
    }
    return interactionHistory.map((contactHistoryInteraction) => {
      if (contactHistoryInteraction.get('interactionId') === action.interactionId) {
        return contactHistoryInteraction.mergeIn(['interactionDetails'], fromJS(action.interactionDetails));
      } else {
        return contactHistoryInteraction;
      }
    });
  });

const updateContactInteractionHistoryResults = (contact, action) => {
  if (contact !== undefined && contact.get('id') === action.contactId) {
    return contact.update('interactionHistory', (interactionHistory) => {
      if (typeof action.response.results === 'undefined') {
        return action.response.results;
      } else if (typeof interactionHistory === 'undefined' || action.response.page === interactionHistory.get('nextPage')) {
        const existingResults = interactionHistory ? interactionHistory.get('results') : false;
        return new Map({
          nextPage: action.response.page + 1,
          page: action.response.page,
          total: action.response.total,
          results: existingResults ? existingResults.concat(fromJS(action.response.results)) : fromJS(action.response.results),
        });
      } else {
        return interactionHistory;
      }
    });
  } else {
    return contact;
  }
};

function agentDesktopReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_REFRESH_NOTIF:
      return state.set('refreshRequired', action.show);
    case SET_USER_CONFIG: {
      const presenceReasonLists = action.response.reasonLists.filter((list) => list.active === true);
      let newState = state.set('userConfig', fromJS(action.response));
      if (presenceReasonLists) {
        newState = newState.set('presenceReasonLists', fromJS(
          presenceReasonLists.map((reasonList) => {
            reasonList.reasons = categorizeItems(reasonList.reasons, 'reasons'); // eslint-disable-line no-param-reassign
            return reasonList;
          }
        )));
      }
      return newState;
    }
    case SET_EXTENSIONS:
      return state
        // Set active extension to the first available one if it isn't set
        .set('activeExtension', action.response.activeExtension ? fromJS(action.response.activeExtension) : fromJS(action.response.extensions[0]))
        .set('extensions', fromJS(action.response.extensions));
    case SET_ACTIVE_EXTENSION:
      return state.set('activeExtension', fromJS(action.activeExtension));
    case SET_QUEUES:
      return state.set('queues', fromJS(action.queues));
    case SET_PRESENCE: {
      const systemPresenceReasonList = state.get('presenceReasonLists').find((reasonList) => reasonList.get('name') === 'System Presence Reasons');
      const isSystemReason = (
        action.presenceInfo.reasonListId === null ||
        (systemPresenceReasonList && (systemPresenceReasonList.get('id') === action.presenceInfo.reasonListId))
      );
      return state
        .set('presence', action.presenceInfo.state)
        .set('presenceReason', fromJS({
          reason: action.presenceInfo.reason,
          reasonId: action.presenceInfo.reasonId,
          listId: action.presenceInfo.reasonListId,
          isSystemReason,
        }));
    }
    case SET_INTERACTION_STATUS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        const automaticallyAcceptInteraction = action.newStatus === 'work-accepting' && state.get('selectedInteractionId') === undefined;
        const newState = state
          .updateIn(['interactions', interactionIndex], (interaction) => {
            let updatedInteraction = interaction.set('status', action.newStatus);
            // If we're accepting an existing voice conference, make any updates that have happened to the participants since the work offer
            if (interaction.get('channelType') === 'voice' && action.response !== undefined) {
              // Update customerOnHold and recording
              updatedInteraction = updatedInteraction.set('onHold', action.response.customerOnHold === true)
                .set('recording', action.response.recording === true);
              // Remove any resources that are no longer on the interaction
              if (action.response.activeResources) {
                updatedInteraction = updatedInteraction.update('warmTransfers', (warmTransfers) =>
                  warmTransfers.filter((warmTransfer) => {
                    let containsResource = false;
                    action.response.activeResources.forEach((resource) => {
                      if (resource.id === warmTransfer.get('targetResource')) {
                        containsResource = true;
                      }
                    });
                    return containsResource;
                  })
                );
                // Update muted and onHolds that have changed
                action.response.activeResources.forEach((resource) => {
                  const resourceIndex = interaction.get('warmTransfers').findIndex((warmTransfer) =>
                    warmTransfer.get('targetResource') === resource.id
                  );
                  if (resourceIndex !== -1) {
                    updatedInteraction = updatedInteraction.updateIn(['warmTransfers', resourceIndex], (warmTransfer) =>
                      warmTransfer.set('muted', resource.muted)
                        .set('onHold', resource.onHold)
                    );
                  } else {
                    throw new Error(`Resource not found to update: ${resource.id}`);
                  }
                });
              }
            }
            return updatedInteraction;
          })
          .set('selectedInteractionId',
            automaticallyAcceptInteraction
            ? action.interactionId
            : state.get('selectedInteractionId'));
        if (action.newStatus === 'wrapup') {
          const wrapupTimeout = state.getIn(['interactions', interactionIndex, 'wrapupDetails', 'wrapupTime']);
          const newTimeout = Date.now() + (wrapupTimeout * 1000);
          return newState.setIn(['interactions', interactionIndex, 'timeout'], newTimeout);
        }
        return newState;
      }
      return state;
    }
    case START_OUTBOUND_INTERACTION: {
      const outboundInteraction = new Map(new Interaction({
        channelType: action.channelType,
        customer: action.customer,
        contact: action.contact,
        direction: 'outbound',
        status: 'connecting-to-outbound',
      }));
      return state
        .set('interactions', state.get('interactions').push(outboundInteraction))
        .set('selectedInteractionId', action.channelType === 'sms' ? outboundInteraction.get('interactionId') : state.get('interactionId'));
    }
    case INITIALIZE_OUTBOUND_SMS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.placeholderInteractionId
      );
      return state.updateIn(['interactions', interactionIndex], (interaction) =>
        interaction.set('interactionId', action.interactionId)
          .set('status', 'initialized-outbound')
          .set('messageHistory', new List().push(new Message({
            text: action.message,
            from: 'Agent',
            type: 'agent',
            timestamp: (new Date()).toISOString(),
            unread: false,
          })))
      // Update the selected interactionId to match the new one (if it is selected)
      ).set('selectedInteractionId', state.get('selectedInteractionId') === action.placeholderInteractionId ? action.interactionId : state.get('selectedInteractionId'));
    }
    case ADD_INTERACTION: {
      // Don't re-add outbound SMS interaction. It was already added by INITIALIZE_OUTBOUND_SMS. Update it's status instead.
      if (!(action.response.direction === 'outbound' && action.response.channelType === 'sms')) {
        // If interaction was already added by START_OUTBOUND_INTERACTION, replace it; otherwise, just push it to the list
        const interactionIndex = state.get('interactions').findIndex(
          (interaction) => (interaction.get('direction') === 'outbound' && interaction.get('channelType') === action.response.channelType)
        );
        const interactionToAdd = new Map(new Interaction(action.response));
        if (interactionIndex !== -1) {
          return state.setIn(['interactions', interactionIndex], interactionToAdd);
        } else {
          return state.set('interactions', state.get('interactions').push(interactionToAdd));
        }
      } else {
        return state;
      }
    }
    case UPDATE_WRAPUP_DETAILS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex > -1) {
        return state.mergeIn(['interactions', interactionIndex, 'wrapupDetails'], fromJS(action.wrapupDetails));
      }
      return state;
    }
    case ADD_SCRIPT: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex > -1) {
        return state.setIn(['interactions', interactionIndex, 'script'], fromJS(action.script));
      } else {
        return state;
      }
    }
    case REMOVE_SCRIPT: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex > -1) {
        return state.setIn(['interactions', interactionIndex, 'script'], undefined);
      } else {
        return state;
      }
    }
    case WORK_INITIATED: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.response.interactionId
      );
      return state.updateIn(['interactions', interactionIndex],
        (interaction) => interaction
          .set('status', 'work-initiated')
          .set('number', interaction.get('channelType') === 'voice' ? action.response.customer : undefined)
      );
    }
    case REMOVE_INTERACTION: {
      // If the interaction being removed is the selected interaction, select the next interaction (voice, first non-voice)
      let nextSelectedInteractionId;
      if (state.get('selectedInteractionId') === action.interactionId) {
        const interactionBeingRemoved = state.get('interactions').find(
          (interaction) => interaction.get('interactionId') === action.interactionId
        );
        const currentVoiceInteraction = state.get('interactions').find(
          (interaction) => interaction.get('channelType') === 'voice'
        );
        if (interactionBeingRemoved.get('channelType') !== 'voice' && currentVoiceInteraction) {
          nextSelectedInteractionId = currentVoiceInteraction.get('interactionId');
        } else {
          const firstNonVoiceInteraction = state.get('interactions').find(
            (interaction) => interaction.get('channelType') !== 'voice' &&
              interaction.get('interactionId') !== action.interactionId
          );
          nextSelectedInteractionId = firstNonVoiceInteraction ? firstNonVoiceInteraction.get('interactionId') : undefined;
        }
      } else {
        nextSelectedInteractionId = state.get('selectedInteractionId');
      }

      return state
        .set('interactions', state.get('interactions').filterNot((interaction) =>
          interaction.get('interactionId') === action.interactionId
        ))
        .set('selectedInteractionId', nextSelectedInteractionId);
    }
    case SET_MESSAGE_HISTORY: {
      if (action.response && action.response.length > 0) {
        const messageInteractionIndex = state.get('interactions').findIndex(
          (interaction) => interaction.get('interactionId') === action.response[0].channelId
        );
        const messageInteraction = state.getIn(['interactions', messageInteractionIndex]);
        if (messageInteraction) {
          const messageHistoryItems = new List(action.response.map((messageHistoryItem) =>
            new ResponseMessage(messageHistoryItem, state.get('selectedInteractionId'), action.agentId)
          ));
          return state.updateIn(['interactions', messageInteractionIndex], (interaction) =>
            interaction.set('messageHistory', messageHistoryItems)
          );
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    case SET_CONTACT_ACTION: {
      if (action.interactionId === undefined) {
        return state
          .setIn(['noInteractionContactPanel', 'contactAction'],
            action.newAction
          );
      } else {
        const interactionIndex = state.get('interactions').findIndex(
          (interaction) => interaction.get('interactionId') === action.interactionId
        );
        if (interactionIndex !== -1) {
          return state
            .updateIn(['interactions', interactionIndex],
              (interaction) => interaction.set('contactAction', action.newAction)
            );
        } else {
          return state;
        }
      }
    }
    case SET_INTERACTION_QUERY: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .updateIn(['interactions', interactionIndex],
            (interaction) => interaction.set('query', fromJS(action.query))
          );
      } else {
        return state;
      }
    }
    case ADD_SEARCH_FILTER: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === state.get('selectedInteractionId')
      );

      let addSearchFilterPath;

      if (interactionIndex !== -1) {
        addSearchFilterPath = ['interactions', interactionIndex, 'query'];
      } else {
        addSearchFilterPath = ['noInteractionContactPanel', 'query'];
      }

      return state
        .updateIn(addSearchFilterPath,
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
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === state.get('selectedInteractionId')
      );

      let removeSearchFilterPath;

      if (interactionIndex !== -1) {
        removeSearchFilterPath = ['interactions', interactionIndex, 'query'];
      } else {
        removeSearchFilterPath = ['noInteractionContactPanel', 'query'];
      }

      if (action.filterName) {
        return state
          .updateIn(removeSearchFilterPath,
            (query) => query.delete(action.filterName)
          );
      } else {
        return state
          .setIn(removeSearchFilterPath, fromJS({}));
      }
    }
    case ASSIGN_CONTACT: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => {
                  const updatedInteraction = interaction.set('contact', fromJS(action.contact));
                  if (action.contact) {
                    return updatedInteraction.set('contactAction', 'view');
                  }
                  return updatedInteraction;
                }
              )
          );
      } else {
        return state;
      }
    }
    case SET_SIDE_PANEL_TAB_INDEX: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      const target = interactionIndex !== -1 ? ['interactions', interactionIndex] : ['noInteractionContactPanel'];
      target.push('sidePanelTabIndex');
      return state.setIn(target, action.tabIndex);
    }
    case SET_CONTACT_HISTORY_INTERACTION_DETAILS: {
      return state.update('interactions',
        (interactions) => interactions.map(
          (interaction) => setContactInteractionDetails(interaction, action)
        )).update(
        'noInteractionContactPanel',
        (noInteractionContactPanel) => setContactInteractionDetails(noInteractionContactPanel, action)
      );
    }
    case SET_CONTACT_INTERACTION_HISTORY: {
      return state.update('interactions', (interactions) =>
        interactions.map(
          (interaction) => interaction.update('contact', (contact) => updateContactInteractionHistoryResults(contact, action))
        )
      ).updateIn(['noInteractionContactPanel', 'contact'], (contact) =>
        updateContactInteractionHistoryResults(contact, action)
      );
    }
    case SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      const target = interactionIndex !== -1 ? ['interactions', interactionIndex] : ['noInteractionContactPanel'];
      return state.updateIn(target, (interaction) => {
        if (interaction.getIn(['contact', 'interactionHistory']) !== undefined) {
          return interaction.updateIn(['contact', 'interactionHistory', 'results'], (interactionHistoryResults) =>
            interactionHistoryResults.map((contactHistoryInteraction) => {
              if (contactHistoryInteraction.get('interactionId') === action.contactHistoryInteractionId) {
                return contactHistoryInteraction.set('interactionDetails', 'loading');
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
      return state.update('interactions',
        (interactions) => interactions.map(
          (interaction) => updateContactInteractionDetails(interaction, action)
        )).update(
        'noInteractionContactPanel',
        (noInteractionContactPanel) => updateContactInteractionDetails(noInteractionContactPanel, action)
      );
    }
    case ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY: {
      return state.update(
        'interactions',
        (interactions) => interactions.map(
          (interaction) => addContactInteractionNote(interaction, action)
        )
      ).update(
        'noInteractionContactPanel',
        (noInteractionContactPanel) => addContactInteractionNote(noInteractionContactPanel, action)
      );
    }
    case UPDATE_CONTACT: {
      return state.update('interactions', (interactions) => interactions.map((interaction) => {
        if (interaction.getIn(['contact', 'id']) === action.updatedContact.id) {
          return interaction.mergeIn(['contact'], fromJS(action.updatedContact));
        }
        return interaction;
      })).updateIn(['noInteractionContactPanel', 'contact'], (contact) => {
        if (contact && contact.get('id') === action.updatedContact.id) {
          return contact.merge(fromJS(action.updatedContact));
        }
        return contact;
      });
    }
    case REMOVE_CONTACT: {
      return state.update('interactions', (interactions) => interactions.map((interaction) => {
        if (interaction.getIn(['contact', 'id']) === action.contactId) {
          return interaction.delete('contact');
        }
        return interaction;
      })).update('noInteractionContactPanel', (noInteractionContactPanel) => {
        if (noInteractionContactPanel.getIn(['contact', 'id']) === action.contactId) {
          return noInteractionContactPanel.delete('contact');
        }
        return noInteractionContactPanel;
      });
    }
    case ADD_MESSAGE: {
      if (!(action.message instanceof Message)) {
        throw new Error('ADD_MESSAGE message must be of type Message');
      }
      const messageInteractionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (messageInteractionIndex !== -1) {
        return state.updateIn(['interactions', messageInteractionIndex, 'messageHistory'], (messageHistory) =>
          messageHistory.push(action.message)
        );
      } else {
        return state;
      }
    }
    case SELECT_INTERACTION: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .set('selectedInteractionId', action.interactionId)
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) =>
                  interaction.set('messageHistory',
                    interaction.get('messageHistory') !== undefined
                    ? interaction.get('messageHistory').map((messageHistoryItem) => messageHistoryItem.set('unread', false))
                    : undefined
                  )
              )
          );
      } else {
        return state;
      }
    }
    case SET_CUSTOM_FIELDS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('customFields', action.customFields)
              )
          );
      } else {
        return state;
      }
    }
    case SET_EMAIL_PLAIN_BODY: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      return state.updateIn(['interactions', interactionIndex], (interaction) =>
        interaction.set('emailPlainBody', action.body)
      );
    }
    case SET_EMAIL_HTML_BODY: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      return state.updateIn(['interactions', interactionIndex], (interaction) =>
        interaction.set('emailHtmlBody', action.body)
      );
    }
    case SET_EMAIL_DETAILS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      return state.updateIn(['interactions', interactionIndex], (interaction) =>
        interaction.set('emailDetails', fromJS(action.details))
      );
    }
    case SET_EMAIL_ATTACHMENT_URL: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex, 'emailDetails', 'attachments'], (attachments) =>
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
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 &&
          action.transferringTo !== undefined &&
          action.transferringTo.id !== undefined &&
          action.transferringTo.type !== undefined &&
          action.transferringTo.name !== undefined) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.update('warmTransfers', (warmTransfers) =>
            warmTransfers.push(fromJS({ ...action.transferringTo, status: 'transferring' })))
        );
      } else {
        return state;
      }
    }
    case TRANSFER_CANCELLED: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) => {
          const cancellingTransferIndex = interaction.get('warmTransfers').findIndex(
            (warmTransfer) => warmTransfer.get('status') === 'transferring'
          );
          if (cancellingTransferIndex !== -1) {
            return interaction.update('warmTransfers', (warmTransfers) =>
              warmTransfers.delete(cancellingTransferIndex)
            );
          } else {
            return interaction;
          }
        });
      } else {
        return state;
      }
    }
    case RESOURCE_ADDED: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.response.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) => {
          const connectingTransferIndex = interaction.get('warmTransfers').findIndex(
            (warmTransfer) => warmTransfer.get('status') === 'transferring'
          );
          if (connectingTransferIndex !== -1) {
            return interaction.updateIn(['warmTransfers', connectingTransferIndex], (warmTransfer) =>
              warmTransfer.set('status', 'connected')
                .set('targetResource', action.response.extraParams.targetResource)
            );
          } else {
            return interaction.update('warmTransfers', (warmTransfers) =>
              warmTransfers.push(fromJS({
                targetResource: action.response.extraParams.targetResource,
                name: action.response.extraParams.displayName,
                status: 'connected',
              }))
            );
          }
        });
      } else {
        return state;
      }
    }
    case UPDATE_RESOURCE_NAME: {
      return state.update('interactions', (interactions) => interactions.map((interaction) => {
        if (interaction.get('warmTransfers') !== undefined && interaction.get('warmTransfers').size > 0) {
          return interaction.update('warmTransfers', (warmTransfers) => warmTransfers.map((warmTransfer) => {
            if (warmTransfer.get('id') === action.response.result.id) {
              const name = action.response.result.firstName || action.response.result.lastName ? `${action.response.result.firstName} ${action.response.result.lastName}` : action.response.result.email;
              return warmTransfer.set('name', name);
            } else {
              return warmTransfer;
            }
          }));
        } else {
          return interaction;
        }
      }));
    }
    case UPDATE_RESOURCE_STATUS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex, 'warmTransfers'], (warmTransfers) => {
          const resourceToUpdate = warmTransfers.findIndex((warmTransfer) =>
            warmTransfer.get('targetResource') === action.targetResource
          );
          if (resourceToUpdate !== -1) {
            return warmTransfers.update(resourceToUpdate, (warmTransfer) => {
              if (!(action.statusKey === 'onHold' && action.statusValue === true)) {
                return warmTransfer.set(action.statusKey, action.statusValue);
              } else {
                // Also set muted to false if resource is being resumed
                return warmTransfer.set(action.statusKey, action.statusValue)
                  .set('muted', false);
              }
            });
          } else {
            return warmTransfers;
          }
        });
      } else {
        return state;
      }
    }
    case HOLD_ME: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('meOnHold', true)
        );
      } else {
        return state;
      }
    }
    case RESUME_ME: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('meOnHold', false)
            .set('muted', false)
        );
      } else {
        return state;
      }
    }
    case RESOURCE_REMOVED: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.response.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex, 'warmTransfers'], (warmTransfers) => {
          const resourceToRemoveIndex = warmTransfers.findIndex((warmTransfer) =>
            warmTransfer.get('targetResource') === action.response.extraParams.targetResource
          );
          if (resourceToRemoveIndex !== -1) {
            return warmTransfers.delete(resourceToRemoveIndex);
          } else {
            return warmTransfers;
          }
        });
      } else {
        return state;
      }
    }
    case MUTE_CALL: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('muted', true)
              )
          );
      } else {
        return state;
      }
    }
    case UNMUTE_CALL: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('muted', false)
              )
          );
      } else {
        return state;
      }
    }
    case HOLD_CALL: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('onHold', true)
              )
          );
      } else {
        return state;
      }
    }
    case RESUME_CALL: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('onHold', false)
              )
          );
      } else {
        return state;
      }
    }
    case RECORD_CALL: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('recording', true)
              )
          );
      } else {
        return state;
      }
    }
    case STOP_RECORD_CALL: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('recording', false)
              )
          );
      } else {
        return state;
      }
    }
    case EMAIL_CREATE_REPLY: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 && state.get('interactions').get(interactionIndex).get('channelType') === 'email') {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('emailReply', fromJS({
                  tos: interaction.get('emailDetails').get('from'),
                  ccs: interaction.get('emailDetails').get('cc'),
                  bccs: interaction.get('emailDetails').get('bcc'),
                  subject: `RE: ${interaction.get('emailDetails').get('subject')}`,
                  attachments: [],
                  message: '',
                }))
              )
          );
      } else {
        return state;
      }
    }
    case EMAIL_CANCEL_REPLY: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 && state.get('interactions').get(interactionIndex).get('channelType') === 'email') {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('emailReply', undefined)
              )
          );
      } else {
        return state;
      }
    }
    case EMAIL_ADD_ATTACHMENT: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 && state.get('interactions').get(interactionIndex).get('channelType') === 'email') {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.updateIn(['emailReply', 'attachments'], (attachments) => {
            if (action.attachment.attachmentId === undefined) {
              return attachments.push(fromJS(action.attachment));
            } else {
              const loadingAttachmentIndex = attachments.findIndex((attachment) =>
                attachment.get('attachmentId') === undefined
              );
              if (loadingAttachmentIndex !== -1) {
                return attachments.remove(loadingAttachmentIndex).push(fromJS(action.attachment));
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
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 && state.get('interactions').get(interactionIndex).get('channelType') === 'email') {
        return state.updateIn(['interactions', interactionIndex, 'emailReply', 'attachments'], (attachments) =>
          attachments.filter((attachment) =>
            attachment.get('attachmentId') !== action.attachmentId
          )
        );
      } else {
        return state;
      }
    }
    case EMAIL_UPDATE_REPLY: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 && state.get('interactions').get(interactionIndex).get('channelType') === 'email') {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.setIn(['emailReply', 'message'], action.reply.message)
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
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 && state.get('interactions').get(interactionIndex).get('channelType') === 'email') {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('sendingReply', true)
        );
      } else {
        return state;
      }
    }
    case UPDATE_NOTE: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state.mergeIn(['interactions', interactionIndex, 'note'], action.note);
      } else {
        return state;
      }
    }
    case UPDATE_SCRIPT_VALUES: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], (interaction) => {
          if (interaction.get('script') !== undefined) {
            return interaction.setIn(['script', 'values'], action.scriptValueMap);
          } else {
            return interaction;
          }
        });
      } else {
        return state;
      }
    }
    case SET_DISPOSITION_DETAILS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        const categorizedDispositions = categorizeItems(action.dispositions, 'dispositions');
        return state.setIn(['interactions', interactionIndex, 'dispositionDetails'], fromJS({
          forceSelect: action.forceSelect,
          dispositions: categorizedDispositions,
          selected: [],
        }));
      } else {
        return state;
      }
    }
    case SELECT_DISPOSITION: {
      const selectedInteractionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      return state.setIn(
        ['interactions', selectedInteractionIndex, 'dispositionDetails', 'selected'],
        fromJS(action.disposition ? [action.disposition] : []),
      );
    }
    case SELECT_CONTACT: {
      return state.mergeIn(['noInteractionContactPanel'], fromJS({
        contact: action.contact,
        contactAction: 'view',
      }));
    }
    default:
      return state;
  }
}

export default agentDesktopReducer;
