/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_PRESENCE,
  SET_INTERACTION_STATUS,
  ADD_INTERACTION,
  WORK_INITIATED,
  REMOVE_INTERACTION,
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  SET_INTERACTION_QUERY,
  SET_MESSAGE_HISTORY,
  SET_CONTACT_ACTION,
  ASSIGN_CONTACT,
  ADD_MESSAGE,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
  MUTE_CALL,
  UNMUTE_CALL,
  HOLD_CALL,
  RESUME_CALL,
  RECORD_CALL,
  STOP_RECORD_CALL,
  EMAIL_CREATE_REPLY,
  EMAIL_CANCEL_REPLY,
} from './constants';

const initialState = fromJS({
  interactions: [
    // XXX uncomment below to mock email(s)
    // {
    //   channelType: 'email',
    //   interactionId: '0000000-0000-0000-0000-111111111',
    //   status: 'work-accepted', // 'work-offer',
    //   timeout: new Date(Date.now() + 60000).toISOString(),
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
    //   email: {
    //     to: 'support@help.com',
    //     from: 'test@yahoo.com',
    //     timestamp: new Date().toISOString(),
    //     subject: 'Files not uploading to my Cloud account',
    //     content: 'Hello,<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/><b>John Englebert</b><br/>Software Developer<br/>An Organization<br/>313.218.9814',
    //   },
    // },

    // XXX uncomment below to mock voice interaction
    // {
    //   channelType: 'voice',
    //   interactionId: '0000000-0000-0000-0000-3333333333333',
    //   status: 'work-accepted', // 'work-offer',
    //   timeout: new Date(Date.now() + 60000).toISOString(),
    //   number: '313.412.6623',
    //   recording: true,
    //   agentRecordingEnabled: true, // false
    // },
    //
    //   XXX uncomment below to mock SMS interaction
    //   {
    //     channelType: 'sms',
    //     customerAvatarIndex: 5,
    //     interactionId: '11111111111111111111112',
    //     status: 'work-accepted',
    //     messageHistory: [
    //       {
    //         text: 'this is a test',
    //         from: '15552213456',
    //         type: 'sms',
    //         timestamp: new Date().toISOString(),
    //       },
    //     ],
    //     contact: mockContact(),
    //     hasUnreadMessage: false,
    //   },
    // ],
    // selectedInteractionId: '11111111111111111111112',
  ],
});

function agentDesktopReducer(state = initialState, action) {
  switch (action.type) {
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
                (interaction) => {
                  // We only want to set hasUnreadMessage for messaging/sms interactions
                  let hasUnreadMessage;
                  if ((interaction.get('channelType') === 'messaging' || interaction.get('channelType') === 'sms') &&
                      (action.newStatus === 'work-accepting' || action.newStatus === 'work-accepted') &&
                      state.get('selectedInteractionId') !== interaction.get('interactionId')) {
                    hasUnreadMessage = true;
                  }
                  return interaction
                    .set('status', action.newStatus)
                    .set('hasUnreadMessage', hasUnreadMessage);
                }
              )
          ).set('selectedInteractionId',
            automaticallyAcceptInteraction
            ? action.interactionId
            : state.get('selectedInteractionId'));
      } else {
        return state;
      }
    }
    case ADD_INTERACTION: {
      let agentRecordingEnabled;
      let recording;
      let onHold;
      let muted;
      if (action.response.channelType === 'voice') {
        // recordingUpdate could be undefined for old flows, but should be enabled in that case
        agentRecordingEnabled = action.response.toolbarFeatures.recordingUpdate !== false;
        // recording and onHold can have been set by an incoming transfer
        recording = action.response.recording === true;
        onHold = action.response.customerOnHold === true;
        muted = false;
      }
      const interaction = {
        channelType: action.response.channelType,
        customerAvatarIndex: action.response.channelType !== 'voice' ? Math.floor(Math.random() * 17) : undefined,
        interactionId: action.response.interactionId,
        status: 'work-offer',
        query: {},
        contactAction: 'search',
        contact: {},
        timeout: action.response.timeout,
        agentRecordingEnabled,
        recording,
        onHold,
        muted,
      };
      return state
        .set('interactions', state.get('interactions').push(fromJS(interaction)));
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
    case REMOVE_INTERACTION:
      return state
        .set('interactions', state.get('interactions').filterNot((interaction) =>
          interaction.get('interactionId') === action.interactionId
        ))
        .set('selectedInteractionId', state.get('selectedInteractionId') === action.interactionId ? undefined : state.get('selectedInteractionId'));
    case SET_MESSAGE_HISTORY: {
      if (action.response && action.response.length > 0) {
        const interactionIndex = state.get('interactions').findIndex(
          (interaction) => interaction.get('interactionId') === action.response[0].channelId
        );
        if (interactionIndex !== -1) {
          const messageHistoryItems = action.response.map((messageHistoryItem) => ({
            text: messageHistoryItem.payload.body.text,
            from: messageHistoryItem.payload.metadata && messageHistoryItem.payload.metadata.name ? messageHistoryItem.payload.metadata.name : messageHistoryItem.payload.from,
            type: messageHistoryItem.payload.metadata ? messageHistoryItem.payload.metadata.type : messageHistoryItem.payload.type,
            timestamp: messageHistoryItem.payload.timestamp,
          }));
          return state
            .update('interactions',
              (interactions) =>
                interactions.update(
                  interactionIndex,
                  (interaction) => interaction.set('messageHistory', fromJS(messageHistoryItems))
              )
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
    case ADD_MESSAGE: {
      const message = action.response;
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === message.to
      );
      if (interactionIndex !== -1) {
        const messageHistoryItem = {
          text: message.body.text,
          from: message.metadata !== null ? message.metadata.name : message.from,
          type: message.metadata !== null ? message.metadata.type : message.type,
          timestamp: message.timestamp,
        };
        return state
          .update('interactions',
          (interactions) =>
            interactions.update(
              interactionIndex,
              (interaction) => interaction.update('messageHistory', (messageHistory) => messageHistory.push(fromJS(messageHistoryItem)))
                .set('hasUnreadMessage', state.get('selectedInteractionId') !== interaction.get('interactionId'))
          )
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
                (interaction) => interaction.set('hasUnreadMessage', false)
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
    default:
      return state;
  }
}

export default agentDesktopReducer;
