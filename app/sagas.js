import { fork } from 'redux-saga/effects';

import agentDesktopSagas from 'containers/AgentDesktop/sagas';
import messagingContentAreaSagas from 'containers/MessagingContentArea/sagas';
import toolbarSagas from 'containers/Toolbar/sagas';

export default function* rootSaga() {
  const allSagas = [
    ...agentDesktopSagas,
    ...messagingContentAreaSagas,
    ...toolbarSagas,
  ];
  for (let i = 0; i < allSagas.length; i += 1) {
    yield fork(allSagas[i]);
  }
}
