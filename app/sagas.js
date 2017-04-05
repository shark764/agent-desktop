import agentDesktopSagas from 'containers/AgentDesktop/sagas';

export default function runSagas(sagaMiddleware) {
  [
    ...agentDesktopSagas,
  ].forEach((saga) => {
    sagaMiddleware.run(saga);
  });
}
