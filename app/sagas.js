/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { all, fork } from 'redux-saga/effects';

import agentDesktopSagas from 'containers/AgentDesktop/sagas';
import messagingContentAreaSagas from 'containers/MessagingContentArea/sagas';
import emailContentAreaSagas from 'containers/EmailContentArea/sagas';
import toolbarSagas from 'containers/Toolbar/sagas';
import errorSagas from 'containers/Errors/sagas';
import infoTabSagas from 'containers/InfoTab/sagas';
import contactSagas from 'containers/ContactsControl/sagas';
import contactSearchSagas from 'containers/ContactSearch/sagas';
import transferMenuSagas from 'containers/TransferMenu/sagas';
import transferDialPadSagas from 'containers/TransferDialPad/sagas';
import outboundIdentifierListSagas from 'containers/OutboundAniSelect/sagas';
import agentTransferMenuPreferenceMenuSagas from 'containers/AgentTransferMenuPreferenceMenu/sagas';

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
    ...outboundIdentifierListSagas,
  ];
  for (let i = 0; i < allSagas.length; i += 1) {
    yield fork(allSagas[i]);
  }
  yield all([...transferMenuSagas]);
  yield all([...transferDialPadSagas]);
  yield all([...agentTransferMenuPreferenceMenuSagas]);
}
