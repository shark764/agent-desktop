/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import reduxErrorMiddleware from 'utils/reduxErrorMiddleware';
import watch from 'redux-watch';

import reducer from './reducers';
import rootSaga from './sagas';
import watchers from './watchers';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
  const middlewares = [sagaMiddleware, reduxErrorMiddleware];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;
  /* eslint-enable */

  const store = createStore(
    reducer,
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

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
