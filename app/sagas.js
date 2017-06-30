/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fork } from 'redux-saga/effects';

import agentDesktopSagas from 'containers/AgentDesktop/sagas';
import messagingContentAreaSagas from 'containers/MessagingContentArea/sagas';
import emailContentAreaSagas from 'containers/EmailContentArea/sagas';
import toolbarSagas from 'containers/Toolbar/sagas';
import errorSagas from 'containers/Errors/sagas';
import contactSagas from 'containers/ContactsControl/sagas';
import contactSearchSagas from 'containers/ContactSearch/sagas';

export default function* rootSaga() {
  const allSagas = [
    ...agentDesktopSagas,
    ...messagingContentAreaSagas,
    ...emailContentAreaSagas,
    ...toolbarSagas,
    ...errorSagas,
    ...contactSagas,
    ...contactSearchSagas,
  ];
  for (let i = 0; i < allSagas.length; i += 1) {
    yield fork(allSagas[i]);
  }
}
