/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import { DEFAULT_LOCALE } from './containers/AgentDesktop/constants';
import enUsTranslationMessages from './translations/en-US.json';

export const appLocales = [
  'en-US',
];


addLocaleData(enLocaleData);

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, enUsTranslationMessages) : {};
  const formattedMessages = {};
  const messageKeys = Object.keys(messages);
  messageKeys.forEach((messageKey) => {
    if (locale === DEFAULT_LOCALE) {
      formattedMessages[messageKey] = messages[messageKey];
    } else {
      formattedMessages[messageKey] = messages[messageKey] || defaultFormattedMessages[messageKey];
    }
  });

  return formattedMessages;
};

export const translationMessages = {
  'en-US': formatTranslationMessages('en-US', enUsTranslationMessages),
};
