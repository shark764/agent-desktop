/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import Raven from 'raven-js';
import { applyMiddleware } from 'redux';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import reduxErrorMiddleware from 'utils/reduxErrorMiddleware';
import watch from 'redux-watch';

import { setCriticalError } from 'containers/Errors/actions';

import reducer from './reducers';
import rootSaga from './sagas';
import watchers from './watchers';

export let store; // eslint-disable-line import/no-mutable-exports

const sagaMiddleware = createSagaMiddleware({
  onError: (error) => {
    console.error(error);
    Raven.captureException(error, {
      logError: !store.getState().hasIn(['errors', 'criticalError']),
    });
    store.dispatch(setCriticalError());
  },
});

export default function configureAppStore(initialState = {}) {
  const middlewares = [sagaMiddleware, reduxErrorMiddleware];
  const enhancers = [applyMiddleware(...middlewares)];

  /**
   * Restricting the extension, we do not allow
   * advanced features on production mode
   */
  const isDevEnv = process.env.NODE_ENV !== 'production';

  store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), ...middlewares],
    preloadedState: fromJS(initialState),
    devTools: {
      features: {
        pause: isDevEnv, // start/pause recording of dispatched actions
        lock: isDevEnv, // lock/unlock dispatching actions and side effects
        persist: isDevEnv, // persist states on page reloading
        export: isDevEnv ? 'custom' : isDevEnv, // export history of actions in a file
        import: isDevEnv ? 'custom' : isDevEnv, // import history of actions from a file
        jump: isDevEnv, // jump back and forth (time travelling)
        skip: isDevEnv, // skip (cancel) actions
        reorder: isDevEnv, // drag and drop actions in the history list
        dispatch: isDevEnv, // dispatch custom actions or action creators
        test: isDevEnv, // generate tests for the selected actions
      },
    },
    enhancers,
  });

  watchers.forEach((watcher) => {
    const watcherName = watch(() => store.getState().toJS(), watcher.statePath);
    store.subscribe(
      watcherName((newVal, oldVal) => {
        watcher.watchAction(newVal, oldVal);
      })
    );
  });

  sagaMiddleware.run(rootSaga);

  return store;
}
