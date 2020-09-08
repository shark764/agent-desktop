/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import { combineReducers } from 'redux-immutable';
import language from 'containers/LanguageProvider/reducer';
import login from 'containers/Login/reducer';
import agentDesktop from 'containers/AgentDesktop/reducer';
import toolbar from 'containers/Toolbar/reducer';
import sidePanel from 'containers/SidePanel/reducer';
import infoTab from 'containers/InfoTab/reducer';
import contactsControl from 'containers/ContactsControl/reducer';
import errors from 'containers/Errors/reducer';
import notificationPreferences from 'containers/AgentNotificationsMenu/reducer';
import audioOutputPreferences from 'containers/AudioOutputMenu/reducer';
import transferMenu from 'containers/TransferMenu/reducer';
import transferDialPad from 'containers/TransferDialPad/reducer';
import outboundAniSelect from 'containers/OutboundAniSelect/reducer';
import transferMenuPreferences from 'containers/AgentTransferMenuPreferenceMenu/reducer';

import { LOGOUT } from 'containers/Login/constants';

const appReducer = combineReducers({
  language,
  login,
  agentDesktop,
  toolbar,
  sidePanel,
  infoTab,
  contactsControl,
  errors,
  notificationPreferences,

  /**
   * Slices return an object with the reducer in
   * https://redux-toolkit.js.org/api/createSlice#return-value
   */
  [audioOutputPreferences.name]: audioOutputPreferences.reducer,

  transferMenu,
  outboundAniSelect,
  transferDialPad,
  transferMenuPreferences,
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === LOGOUT) {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
