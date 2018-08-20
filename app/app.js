/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 * app.js
 *
 * This is the entry file for the application
 */
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import LanguageProvider from 'containers/LanguageProvider';

import ContextProvider from 'containers/ContextProvider';
import App from 'containers/App';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';
import './global-styles';

import configureStore from './store';
import { translationMessages } from './i18n';

const store = configureStore();
window.store = store;

const render = (translatedMessages) => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={translatedMessages}>
        <ContextProvider>
          <App />
        </ContextProvider>
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
  new Promise((resolve) => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/de.js')]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}
