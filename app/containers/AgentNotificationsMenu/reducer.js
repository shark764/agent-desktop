/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentNotificationsMenu reducer
 *
 */

import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  audioNotifications: true,
  visualNotifications: true,
});

export default function notificationPreferencesReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case ACTIONS.SET_AUDIO_NOTIFICATIONS_PREFERENCE:
      return state.set('audioNotifications', action.audioNotifications);
    case ACTIONS.SET_VISUAL_NOTIFICATIONS_PREFERENCE:
      return state.set('visualNotifications', action.visualNotifications);
    default:
      return state;
  }
}
