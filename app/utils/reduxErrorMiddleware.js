/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Raven from 'raven-js';
import { setCriticalError } from 'containers/Errors/actions';
const errorHandler = (error, action, dispatch, state) => {
  Raven.captureException(error, {
    extra: {
      action,
    },
    tags: {
      type: 'redux',
    },
    logError: !state.hasIn(['errors', 'criticalError']),
  });
  dispatch(setCriticalError(error));
  console.error(error);
};

const reduxErrorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    errorHandler(error, action, store.dispatch, store.getState());
    return store.getState();
  }
};
export default reduxErrorMiddleware;
