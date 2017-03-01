/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS, List } from 'immutable';
import {
  SET_EXTENSIONS,
  SET_ACTIVE_EXTENSION,
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
  UPDATE_CONTACT,
  ADD_MESSAGE,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
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
  EMAIL_CANCEL_REPLY,
  UPDATE_NOTE,
} from './constants';

const initialState = fromJS({
  // // Uncomment to allow login screen to be hidden
  // presence: 'notReady',
  interactions: [
    // // XXX uncomment below to mock interaction connecting to outbound (to see loading)
    // {
    //   interactionId: 'outbound-interaction-1',
    //   channelType: 'voice',
    //   direction: 'outbound',
    //   status: 'connecting-to-outbound',
    // },
    // // XXX uncomment below to mock email(s)
    // {
    //   channelType: 'email',
    //   interactionId: '0000000-0000-0000-0000-111111111',
    //   status: 'work-accepted', // 'work-offer',
    //   timeout: new Date(Date.now() + 60000).toISOString(),
    //   query: {},
    //   email: {
    //     to: 'support@help.com',
    //     from: 'j.englebert@yahoo.com',
    //     timestamp: new Date().toISOString(),
    //     subject: 'Files not uploading to my Cloud account',
    //     content: 'Hello,<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/><b>John Englebert</b><br/>Software Developer<br/>An Organization<br/>313.218.9814',
    //   },
    // },
    // {
    //   channelType: 'email',
    //   interactionId: '0000000-0000-0000-0000-222222222222',
    //   status: 'work-accepted', // 'work-offer',
    //   timeout: new Date(Date.now() + 60000).toISOString(),
    //   query: {},
    //   email: {
    //     to: 'support@help.com',
    //     from: 'test@yahoo.com',
    //     timestamp: new Date().toISOString(),
    //     subject: 'Files not uploading to my Cloud account',
    //     content: 'Hello,<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/><b>John Englebert</b><br/>Software Developer<br/>An Organization<br/>313.218.9814',
    //   },
    // },
    //
    // // XXX uncomment below to mock voice interaction
    // {
    //   channelType: 'voice',
    //   interactionId: '0000000-0000-0000-0000-3333333333333',
    //   status: 'work-accepted', // 'work-offer',
    //   timeout: new Date(Date.now() + 60000).toISOString(),
    //   number: '+3134126623',
    //   query: {},
    //   recording: true,
    //   agentRecordingEnabled: true, // false
    //   warmTransfers: [
    //     {
    //       id: '1111111',
    //       type: 'agent',
    //       name: 'Agent with a very very very long name',
    //       status: 'connected',
    //     }, {
    //       id: '22222',
    //       type: 'queue',
    //       name: 'Queue #1',
    //       status: 'connected',
    //     }, {
    //       id: '33333',
    //       type: 'pstn',
    //       name: 'Some PSTN number',
    //       status: 'transferring',
    //     },
    //   ],
    // },
    //
    // //   XXX uncomment below to mock SMS interaction
    // {
    //   channelType: 'sms',
    //   customerAvatarIndex: 5,
    //   interactionId: '11111111111111111111112',
    //   status: 'work-accepted',
    //   query: {},
    //   messageHistory: [
    //     {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    //       unread: false,
    //     }, {
    //       text: 'this is a test',
    //       from: '+15552213456',
    //       type: 'sms',
    //       timestamp: new Date().toISOString(),
    //       unread: false,
    //     },
    //   ],
    // },
    // ],
    // selectedInteractionId: '11111111111111111111112',
  ],
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
    case SET_PRESENCE:
      return state
        .set('presence', action.response.state)
        .set('availablePresences', fromJS(action.response.availableStates));
    case SET_INTERACTION_STATUS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        const automaticallyAcceptInteraction = action.newStatus === 'work-accepting' && state.get('selectedInteractionId') === undefined;
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('status', action.newStatus)
              )
          ).set('selectedInteractionId',
            automaticallyAcceptInteraction
            ? action.interactionId
            : state.get('selectedInteractionId'));
      } else {
        return state;
      }
    }
    case START_OUTBOUND_INTERACTION: {
      return state.set('interactions', state.get('interactions').push(fromJS({
        channelType: action.channelType,
        direction: 'outbound',
        status: 'connecting-to-outbound',
      })));
    }
    case ADD_INTERACTION: {
      let agentRecordingEnabled;
      let recording;
      let onHold;
      let muted;
      let warmTransfers;
      let customerAvatarIndex;
      if (action.response.channelType === 'voice') {
        // recordingUpdate could be undefined for old flows, but should be enabled in that case
        agentRecordingEnabled = action.response.toolbarFeatures.recordingUpdate !== false;
        // recording and onHold can have been set by an incoming transfer
        recording = action.response.recording === true;
        onHold = action.response.customerOnHold === true;
        muted = false;
        warmTransfers = new List();
      } else if (action.response.channelType === 'sms' || action.response.channelType === 'messaging') {
        customerAvatarIndex = Math.floor(Math.random() * 17);
      }
      const interactionToAdd = {
        channelType: action.response.channelType,
        direction: action.response.direction,
        interactionId: action.response.interactionId,
        timeout: action.response.timeout,
        autoAnswer: action.response.autoAnswer,
        status: 'work-offer',
        query: {},
        contactAction: 'search',
        agentRecordingEnabled,
        recording,
        onHold,
        muted,
        warmTransfers,
        customerAvatarIndex,
      };

      // If interaction was already added by START_OUTBOUND_INTERACTION, replace it; otherwise, just push it to the list
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => (interaction.get('status') === 'connecting-to-outbound' && interaction.get('channelType') === action.response.channelType)
      );
      if (interactionIndex !== -1) {
        return state.updateIn(['interactions', interactionIndex], () =>
          fromJS(interactionToAdd)
        );
      } else {
        return state
          .set('interactions', state.get('interactions').push(fromJS(interactionToAdd)));
      }
    }
    case WORK_INITIATED: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.response.interactionId
      );
      return state.update('interactions',
        (interactions) =>
          interactions.update(
            interactionIndex,
            (interaction) => interaction
              .set('status', 'work-initiated')
              .set('number', interaction.get('channelType') === 'voice' ? action.response.customer : undefined)
          )
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
            let from = messageHistoryItem.payload.metadata && messageHistoryItem.payload.metadata.name ? messageHistoryItem.payload.metadata.name : messageHistoryItem.payload.from;
            const type = messageHistoryItem.payload.metadata ? messageHistoryItem.payload.metadata.type : messageHistoryItem.payload.type;
            if (messageInteraction.get('channelType') === 'sms' && type === 'message') {
              if (from[0] !== '+') from = `+${from}`;
            }
            return {
              text: messageHistoryItem.payload.body.text,
              from,
              type,
              timestamp: messageHistoryItem.payload.timestamp,
              unread: state.get('selectedInteractionId') !== undefined && action.response[0].channelId !== state.get('selectedInteractionId'),
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
      if (interactionIndex !== -1) {
        return state
          .updateIn(['interactions', interactionIndex, 'query'],
            (query) => {
              if (action.filterName === 'q') {
                return fromJS({ [action.filterName]: action.value });
              } else {
                return query.set(action.filterName, action.value);
              }
            }
          );
      } else {
        return state;
      }
    }
    case REMOVE_SEARCH_FILTER: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === state.get('selectedInteractionId')
      );
      if (interactionIndex !== -1) {
        if (action.filterName) {
          return state
            .updateIn(['interactions', interactionIndex, 'query'],
              (query) => query.delete(action.filterName)
            );
        } else {
          return state
            .setIn(['interactions', interactionIndex, 'query'], fromJS({}));
        }
      } else {
        return state;
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
                (interaction) => interaction.set('contact', fromJS(action.contact)).set('contactAction', 'view')
              )
          );
      } else {
        return state;
      }
    }
    case UPDATE_CONTACT: {
      return state.update('interactions', (interactions) => interactions.map((interaction) => {
        if (interaction.getIn(['contact', 'id']) === action.updatedContact.id) {
          return interaction.set('contact', fromJS(action.updatedContact));
        }
        return interaction;
      }));
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
                (interaction) => interaction.set('email', interaction.get('email')
                  .set('reply', fromJS({
                    to: interaction.get('email').get('from'),
                    subject: `RE: ${interaction.get('email').get('subject')}`,
                  }))
                )
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
                (interaction) => interaction.set('email', interaction.get('email')
                  .set('reply', undefined)
                )
              )
          );
      } else {
        return state;
      }
    }
    case UPDATE_NOTE: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1 &&
          action.note !== undefined &&
          action.note.title !== undefined &&
          action.note.content !== undefined &&
          action.note.notesPanelHeight !== undefined &&
          action.note.selectedDispositions !== undefined) {
        return state.updateIn(['interactions', interactionIndex], (interaction) =>
          interaction.set('note', fromJS(action.note))
        );
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}

export default agentDesktopReducer;
