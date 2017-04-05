/**
 * app.js
 *
 * This is the entry file for the application
 */
import 'babel-polyfill';
import Raven from 'raven-js';

/* eslint-disable import/no-unresolved, import/extensions */
// Load the manifest.json file and the .htaccess file
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import LanguageProvider from 'containers/LanguageProvider';
import configureStore from 'store';
import './global-styles';
import AgentDesktop from 'containers/AgentDesktop';

// Initialize Remote Logging with Sentry.io
Raven.config('https://4dd03af6283843ccaa18ac2dc221149f@sentry.io/121909', {
  release: '0.0.1',
  environment: 'DEVELOPMENT',
}).install();

// Import i18n messages
import { translationMessages } from './i18n';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';

const store = configureStore();

const render = (translatedMessages) => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={translatedMessages}>
        <AgentDesktop/>
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
