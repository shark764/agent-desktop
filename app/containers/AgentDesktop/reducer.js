/*
 *
 * AgentDesktop reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_TENANT_ID,
  SET_DIRECTION,
  SET_PRESENCE,
  SET_AVAILABLE_PRESENCES,
  SET_INTERACTION_STATUS,
  ADD_INTERACTION,
  REMOVE_INTERACTION,
  SET_MESSAGE_HISTORY,
  ADD_MESSAGE,
  SELECT_INTERACTION,
  SET_CUSTOM_FIELDS,
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
  ],
});

function agentDesktopReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TENANT_ID:
      return state
        .set('tenantId', action.tenantId);
    case SET_DIRECTION:
      return state
        .set('direction', action.direction);
    case SET_PRESENCE:
      return state
        .set('presence', action.presence);
    case SET_AVAILABLE_PRESENCES:
      return state
        .set('availablePresences', fromJS(action.presences));
    case SET_INTERACTION_STATUS: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        const automaticallyAcceptInteraction = action.newStatus === 'work-accepted' && state.get('selectedInteractionId') === undefined;
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('status', action.newStatus)
                  .set('hasUnreadMessage', !automaticallyAcceptInteraction)
              )
          ).set('selectedInteractionId',
            automaticallyAcceptInteraction
            ? action.interactionId
            : state.get('selectedInteractionId'));
      } else {
        return state;
      }
    }
    case ADD_INTERACTION:
      return state
        .set('interactions', state.get('interactions').push(fromJS(action.interaction)));
    case REMOVE_INTERACTION:
      return state
        .set('interactions', state.get('interactions').filterNot((interaction) =>
          interaction.get('interactionId') === action.interactionId
        ))
        .set('selectedInteractionId', state.get('selectedInteractionId') === action.interactionId ? undefined : state.get('selectedInteractionId'));
    case SET_MESSAGE_HISTORY: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.set('messageHistory', fromJS(action.messageHistoryItems))
              )
          );
      } else {
        return state;
      }
    }
    case ADD_MESSAGE: {
      const interactionIndex = state.get('interactions').findIndex(
        (interaction) => interaction.get('interactionId') === action.interactionId
      );
      if (interactionIndex !== -1) {
        return state
          .update('interactions',
            (interactions) =>
              interactions.update(
                interactionIndex,
                (interaction) => interaction.update('messageHistory', (messageHistory) => messageHistory.push(fromJS(action.message)))
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
