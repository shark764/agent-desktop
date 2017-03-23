/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS, Map, List } from 'immutable';

import Interaction from 'models/Interaction';

import {
  SET_EXTENSIONS,
  UPDATE_WRAPUP_DETAILS,
  ADD_SCRIPT,
  REMOVE_SCRIPT,
  SET_ACTIVE_EXTENSION,
  SET_QUEUES,
  SET_PRESENCE,
  SET_INTERACTION_STATUS,
  START_OUTBOUND_INTERACTION,
  ADD_INTERACTION,
  WORK_INITIATED,
  REMOVE_INTERACTION,
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  SET_INTERACTION_QUERY,
  SET_MESSAGE_HISTORY,
  SET_CONTACT_ACTION,
  ASSIGN_CONTACT,
  SET_CONTACT_INTERACTION_HISTORY,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING,
  SET_CONTACT_HISTORY_INTERACTION_DETAILS,
  ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY,
  UPDATE_CONTACT,
  SELECT_CONTACT,
  ADD_MESSAGE,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  SET_EMAIL_PLAIN_BODY,
  SET_EMAIL_HTML_BODY,
  SET_EMAIL_DETAILS,
  SET_EMAIL_ATTACHMENT_URL,
  START_WARM_TRANSFERRING,
  TRANSFER_CANCELLED,
  TRANSFER_CONNECTED,
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
} from './constants';

// import { outboundConnectingVoiceInteraction, voiceInteractionWithTransfersAndScripts, emailInteraction, smsInteractionWithLotsOfMessagesAndScript } from './assets/mockInteractions'; // eslint-disable-line no-unused-vars

const initialState = fromJS({
  // Uncomment to allow login screen to be hidden
  // presence: 'notReady',
  interactions: [
    // Un-comment out below (and the above imports) to mock interactions (only use one voice interaction at a time):
    // outboundConnectingVoiceInteraction,
    // voiceInteractionWithTransfersAndScripts,
    // emailInteraction,
    // smsInteractionWithLotsOfMessagesAndScript,
  ],
  noInteractionContactPanel: {
    contactAction: 'search',
    query: {},
  },
  queues: [],
  extensions: [],
  activeExtension: {},
});

function agentDesktopReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXTENSIONS:
      return state
        // Set active extension to the first available one if it isn't set
        .set('activeExtension', action.response.activeExtension ? fromJS(action.response.activeExtension) : fromJS(action.response.extensions[0]))
        .set('extensions', fromJS(action.response.extensions));
    case SET_ACTIVE_EXTENSION:
      return state.set('activeExtension', fromJS(action.activeExtension));
    case SET_QUEUES:
      return state.set('queues', fromJS(action.queues));
    case SET_PRESENCE:
      return state
        .set('presence', action.response.state);
    case SET_INTERACTION_STATUS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        const automaticallyAcceptInteraction = action.newStatus === 'work-accepting' && state.get('selectedInteractionId') === undefined;
        const newState = state
          .setIn(['interactions', interactionIndex, 'status'], action.newStatus)
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
      return state.set('interactions', state.get('interactions').push(new Map(new Interaction({
        channelType: action.channelType,
        direction: 'outbound',
        status: 'connecting-to-outbound',
      }))));
    }
    case ADD_INTERACTION: {
      const interactionToAdd = new Map(new Interaction(action.response));
      // If interaction was already added by START_OUTBOUND_INTERACTION, replace it; otherwise, just push it to the list
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => (interaction.get('status') === 'connecting-to-outbound' && interaction.get('channelType') === action.response.channelType)
      );
      if (interactionIndex !== -1) {
        return state.setIn(['interactions', interactionIndex], interactionToAdd);
      } else {
        return state
          .set('interactions', state.get('interactions').push(interactionToAdd));
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
          const messageHistoryItems = action.response.map((messageHistoryItem) => {
            let from = messageHistoryItem.metadata && messageHistoryItem.metadata.name ? messageHistoryItem.metadata.name : messageHistoryItem.from;
            const type = messageHistoryItem.metadata ? messageHistoryItem.metadata.type : messageHistoryItem.type;
            if (messageInteraction.get('channelType') === 'sms' && type === 'message') {
              if (from[0] !== '+') from = `+${from}`;
            }
            return {
              text: messageHistoryItem.body.text,
              from,
              type,
              timestamp: messageHistoryItem.timestamp,
              unread: state.get('selectedInteractionId') !== undefined && action.response[0].to !== state.get('selectedInteractionId'),
            };
          });
          return state
            .updateIn(['interactions', messageInteractionIndex],
              (interaction) => interaction.set('messageHistory', fromJS(messageHistoryItems))
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
    case SET_CONTACT_INTERACTION_HISTORY: {
      return state.update('interactions', (interactions) => interactions.map((interaction) => {
        if (interaction.getIn(['contact', 'id']) === action.response.contactId) {
          // TODO also set stuff for pagination
          return interaction.setIn(['contact', 'interactionHistory'], fromJS(action.response.results));
        } else {
          return interaction;
        }
      })).updateIn(['noInteractionContactPanel', 'contact'], (contact) => {
        if (contact && contact.get('id') === action.response.contactId) {
          return contact.set('interactionHistory', fromJS(action.response.results));
        } else {
          return contact;
        }
      });
    }
    case SET_CONTACT_HISTORY_INTERACTION_DETAILS_LOADING: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      const target = interactionIndex !== -1 ? ['interactions', interactionIndex] : ['noInteractionContactPanel'];
      return state.updateIn(target, (interaction) => {
        if (interaction.getIn(['contact', 'interactionHistory']) !== undefined) {
          return interaction.updateIn(['contact', 'interactionHistory'], (interactionHistory) =>
            interactionHistory.map((contactHistoryInteraction) => {
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
    case SET_CONTACT_HISTORY_INTERACTION_DETAILS: {
      return state.set('interactions', state.get('interactions').map((interaction) =>
        interaction.updateIn(['contact', 'interactionHistory'], (interactionHistory) => {
          if (typeof interactionHistory === 'undefined') {
            return interactionHistory;
          }
          return interactionHistory.map((contactHistoryInteraction) => {
            if (contactHistoryInteraction.get('interactionId') === action.response.details.interactionId) {
              return contactHistoryInteraction.set('interactionDetails', fromJS(action.response.details));
            } else {
              return contactHistoryInteraction;
            }
          });
        }))).updateIn(['noInteractionContactPanel', 'contact', 'interactionHistory'], (interactionHistory) => {
          if (typeof interactionHistory === 'undefined') {
            return interactionHistory;
          }
          return interactionHistory.map((contactHistoryInteraction) => {
            if (contactHistoryInteraction.get('interactionId') === action.response.details.interactionId) {
              return contactHistoryInteraction.set('interactionDetails', fromJS(action.response.details));
            } else {
              return contactHistoryInteraction;
            }
          });
        });
    }
    case ADD_NOTES_TO_CONTACT_INTERACTION_HISTORY: {
      return state.set('interactions', state.get('interactions').map((interaction) =>
        interaction.updateIn(['contact', 'interactionHistory'], (interactionHistory) => {
          if (typeof interactionHistory === 'undefined') {
            return interactionHistory;
          }
          return interactionHistory.map((contactHistoryInteraction) => {
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
          });
        }))).updateIn(['noInteractionContactPanel', 'contact', 'interactionHistory'], (interactionHistory) => {
          if (typeof interactionHistory === 'undefined') {
            return interactionHistory;
          }
          return interactionHistory.map((contactHistoryInteraction) => {
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
          });
        });
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
    case ADD_MESSAGE: {
      const message = action.response;
      const messageInteractionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === message.to
      );
      const messageInteraction = state.getIn(['interactions', messageInteractionIndex]);
      if (messageInteractionIndex !== -1) {
        let from = message.metadata !== null ? message.metadata.name : message.from;
        const type = message.metadata !== null ? message.metadata.type : message.type;
        if (messageInteraction.get('channelType') === 'sms' && type === 'message') {
          if (from[0] !== '+') from = `+${from}`;
        }
        const messageHistoryItem = {
          text: message.body.text,
          from,
          type,
          timestamp: message.timestamp,
          unread: state.get('selectedInteractionId') !== undefined && message.to !== state.get('selectedInteractionId'),
        };
        return state
          .updateIn(['interactions', messageInteractionIndex, 'messageHistory'],
            (messageHistory) => messageHistory.push(fromJS(messageHistoryItem))
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
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) =>
                  interaction.update('warmTransfers', (warmTransfers) =>
                    warmTransfers.push(fromJS({ ...action.transferringTo, status: 'transferring' })))
              )
          );
      } else {
        return state;
      }
    }
    case TRANSFER_CANCELLED: {
      const interactionIndex = state.get('interactions').findIndex(
        // TODO TODO TODO do it this way instead when SDK returns interactionId:
        // (interaction) => interaction.get('interactionId') === action.interactionId
        (interaction) => interaction.get('channelType') === 'voice'
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => {
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
                }
              )
          );
      } else {
        return state;
      }
    }
    case TRANSFER_CONNECTED: {
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
                  const connectingTransferIndex = interaction.get('warmTransfers').findIndex(
                    (warmTransfer) => warmTransfer.get('status') === 'transferring'
                  );
                  if (connectingTransferIndex !== -1) {
                    return interaction.update('warmTransfers', (warmTransfers) =>
                      warmTransfers.update(connectingTransferIndex, (warmTransfer) =>
                        warmTransfer.set('status', 'connected')
                      )
                    );
                  } else {
                    return interaction;
                  }
                }
              )
          );
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
        const categorizedDispositions = [];
        action.dispositions.sort((a, b) => a.sortOrder > b.sortOrder).forEach(
          (disposition) => {
            if (disposition.hierarchy[0]) {
              const existingCategoryIndex = categorizedDispositions.findIndex(
                (category) => category.name === disposition.hierarchy[0]
              );
              if (existingCategoryIndex > -1) {
                categorizedDispositions[existingCategoryIndex].dispositions.push(disposition);
              } else {
                categorizedDispositions.push({
                  name: disposition.hierarchy[0],
                  dispositions: [disposition],
                  type: 'category',
                });
              }
            } else {
              categorizedDispositions.push(disposition);
            }
          }
        );
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
