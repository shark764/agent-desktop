/**
 * app.js
 *
 * This is the entry file for the application
 */
import 'babel-polyfill';

/* eslint-disable import/no-unresolved, import/extensions, import/no-webpack-loader-syntax */
// Load the manifest.json file and the .htaccess file
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions, import/no-webpack-loader-syntax */

// Import all the third party stuff
import Raven from 'raven-js';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactUpdates from 'react-dom/lib/ReactUpdates';
import ReactDefaultBatchingStrategy from 'react-dom/lib/ReactDefaultBatchingStrategy';
import { Provider } from 'react-redux';
import LanguageProvider from 'containers/LanguageProvider';
import configureStore from 'store';

import AgentDesktop from 'containers/AgentDesktop';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';
import './global-styles';

import { translationMessages } from './i18n';

let isHandlingError = false;
const ReactTryCatchBatchingStrategy = {
  // this is part of the BatchingStrategy API. simply pass along
  // what the default batching strategy would do.
  get isBatchingUpdates() { return ReactDefaultBatchingStrategy.isBatchingUpdates; },

  batchedUpdates(...args) {
    try {
      ReactDefaultBatchingStrategy.batchedUpdates(...args);
    } catch (e) {
      if (isHandlingError) {
        // our error handling code threw an error. just throw now
        throw e;
      }

      isHandlingError = true;
      try {
        console.error('ReactTryCatchBatchingStrategy caught error', e);
        Raven.captureException(e);
      } finally {
        isHandlingError = false;
      }
    }
  },
};

ReactUpdates.injection.injectBatchingStrategy(ReactTryCatchBatchingStrategy);

const store = configureStore();
window.store = store;

const render = (translatedMessages) => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={translatedMessages}>
        <AgentDesktop />
      </LanguageProvider>
    </Provider>,
    document.getElementById('app')
  );
};


// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(System.import('intl'));
  }))
    .then(() => Promise.all([
      System.import('intl/locale-data/jsonp/de.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}
