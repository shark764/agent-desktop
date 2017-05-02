import { fork } from 'redux-saga/effects';

import agentDesktopSagas from 'containers/AgentDesktop/sagas';

export default function* rootSaga() {
  const allSagas = [
    ...agentDesktopSagas,
  ];
  for (let i = 0; i < allSagas.length; i += 1) {
    yield fork(allSagas[i]);
  }
}
