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

        const importAgentMenuModules = Promise.all([
          System.import('containers/AgentStatusMenu/reducer'),
          System.import('containers/AgentStatusMenu/sagas'),
        ]);

        importAgentMenuModules.then(([reducer, sagas]) => {
          injectReducer('agentStatusMenu', reducer.default);
          injectSagas(sagas.default);
        });

        importAgentMenuModules.catch(errorLoading);

        const importToolbarModules = Promise.all([
          System.import('containers/Toolbar/reducer'),
          System.import('containers/Toolbar/sagas'),
        ]);

        importToolbarModules.then(([reducer, sagas]) => {
          injectReducer('toolbar', reducer.default);
          injectSagas(sagas.default);
        });

        importToolbarModules.catch(errorLoading);

        const importSidePanelModules = Promise.all([
          System.import('containers/SidePanel/reducer'),
          System.import('containers/SidePanel/sagas'),
        ]);

        importSidePanelModules.then(([reducer, sagas]) => {
          injectReducer('sidePanel', reducer.default);
          injectSagas(sagas.default);
        });

        importSidePanelModules.catch(errorLoading);

        const importMainContentAreaModules = Promise.all([
          System.import('containers/MainContentArea/reducer'),
          System.import('containers/MainContentArea/sagas'),
        ]);

        importMainContentAreaModules.then(([reducer, sagas]) => {
          injectReducer('mainContentArea', reducer.default);
          injectSagas(sagas.default);
        });

        importMainContentAreaModules.catch(errorLoading);

        const importInteractionsBarModules = Promise.all([
          System.import('containers/InteractionsBar/reducer'),
        ]);

        importInteractionsBarModules.then(([reducer]) => {
          injectReducer('interactionsBar', reducer.default);
        });

        importInteractionsBarModules.catch(errorLoading);

        const importContactsControlModules = System.import('containers/ContactsControl/reducer');

        importContactsControlModules.then((reducer) => {
          injectReducer('contactsControl', reducer.default);
        });

        importContactsControlModules.catch(errorLoading);

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
