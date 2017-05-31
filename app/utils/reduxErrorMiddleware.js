import Raven from 'raven-js';
import { setCriticalError } from 'containers/Errors/actions';

let reduxHasErrored = false;

const errorHandler = (error, action, dispatch) => {
  if (!reduxHasErrored) {
    if (Raven.isSetup()) {
      Raven.captureException(error, {
        extra: {
          action,
        },
        tags: {
          type: 'redux',
        },
      });
      Raven.uninstall();
    } else {
      console.error('Redux Threw An Error:', error, ' Action: ', action);
    }
    reduxHasErrored = true; // Hacky solution to raven errors still firing after uninstall.
  }
  dispatch(setCriticalError());
  console.error(error);
};

const reduxErrorMiddleware = (store) =>
  (next) => (action) => {
    try {
      return next(action);
    } catch (error) {
      errorHandler(error, action, store.dispatch);
      Raven.uninstall();
      return store.getState();
    }
  };

export default reduxErrorMiddleware;
