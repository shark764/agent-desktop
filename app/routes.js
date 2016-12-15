import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'agentDesktop',
      getComponent(nextState, cb) {
       // --- Add containers here to use them --- //

        const importLoginModules = Promise.all([
          System.import('containers/Login/reducer'),
          System.import('containers/Login/sagas'),
        ]);

        importLoginModules.then(([reducer, sagas]) => {
          injectReducer('login', reducer.default);
          injectSagas(sagas.default);
        });

        importLoginModules.catch(errorLoading);

        // --- End Container Import --- //

        // --- App Top Level --- //

        const importAppModules = Promise.all([
          System.import('containers/AgentDesktop/reducer'),
          System.import('containers/AgentDesktop/sagas'),
          System.import('containers/AgentDesktop'),
        ]);

        const renderRoute = loadModule(cb);

        importAppModules.then(([reducer, sagas, component]) => {
          injectReducer('agentDesktop', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importAppModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
