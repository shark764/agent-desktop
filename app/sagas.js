/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fork } from 'redux-saga/effects';

import agentDesktopSagas from 'containers/AgentDesktop/sagas';
import messagingContentAreaSagas from 'containers/MessagingContentArea/sagas';
import emailContentAreaSagas from 'containers/EmailContentArea/sagas';
import toolbarSagas from 'containers/Toolbar/sagas';
import errorSagas from 'containers/Errors/sagas';
import infoTabSagas from 'containers/InfoTab/sagas';
import contactSagas from 'containers/ContactsControl/sagas';
import contactSearchSagas from 'containers/ContactSearch/sagas';
import agentScriptSagas from 'containers/AgentScript/sagas';
import notificationPreferencesSagas from 'containers/AgentNotificationsMenu/sagas';

export default function* rootSaga() {
  const allSagas = [
    ...agentDesktopSagas,
    ...messagingContentAreaSagas,
    ...emailContentAreaSagas,
    ...toolbarSagas,
    ...errorSagas,
    ...infoTabSagas,
    ...contactSagas,
    ...contactSearchSagas,
    ...agentScriptSagas,
    ...notificationPreferencesSagas,
  ];
  for (let i = 0; i < allSagas.length; i += 1) {
    yield fork(allSagas[i]);
  }
}
