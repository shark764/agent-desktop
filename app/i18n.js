/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import deLocaleData from 'react-intl/locale-data/de';
import esLocaleData from 'react-intl/locale-data/es';
import plLocaleData from 'react-intl/locale-data/pl';
import ptLocaleData from 'react-intl/locale-data/pt';

import { DEFAULT_LOCALE } from './containers/AgentDesktop/constants';
import enUsTranslationMessages from './translations/en-US.json';
import deDeTranslationMessages from './translations/de-DE.json';
import enGbTranslationMessages from './translations/en-GB.json';
import esEsTranslationMessages from './translations/es-ES.json';
import frCaTranslationMessages from './translations/fr-CA.json';
import frFrTranslationMessages from './translations/fr-FR.json';
import plPlTranslationMessages from './translations/pl-PL.json';
import ptBrTranslationMessages from './translations/pt-BR.json';

addLocaleData(enLocaleData);
addLocaleData(frLocaleData);
addLocaleData(deLocaleData);
addLocaleData(esLocaleData);
addLocaleData(plLocaleData);
addLocaleData(ptLocaleData);

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enUsTranslationMessages)
      : {};
  const formattedMessages = {};
  const messageKeys = Object.keys(messages);
  messageKeys.forEach((messageKey) => {
    if (locale === DEFAULT_LOCALE) {
      formattedMessages[messageKey] = messages[messageKey];
    } else {
      formattedMessages[messageKey] =
        messages[messageKey] || defaultFormattedMessages[messageKey];
    }
  });

  return formattedMessages;
};

export const mappedLocales = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'de-DE', label: 'Deutsche (Deutschland)' },
  { value: 'en-GB', label: 'English (Great Britain)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'fr-CA', label: 'Français (Canada)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'pl-PL', label: 'Polski (Polska)' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
];

export const appLocales = [
  'en-US',
  'de-DE',
  'en-GB',
  'es-ES',
  'fr-CA',
  'fr-FR',
  'pl-PL',
  'pt-BR',
];

export const translationMessages = {
  'en-US': formatTranslationMessages('en-US', enUsTranslationMessages),
  'de-DE': formatTranslationMessages('de-DE', deDeTranslationMessages),
  'en-GB': formatTranslationMessages('en-GB', enGbTranslationMessages),
  'es-ES': formatTranslationMessages('es-ES', esEsTranslationMessages),
  'fr-CA': formatTranslationMessages('fr-CA', frCaTranslationMessages),
  'fr-FR': formatTranslationMessages('fr-FR', frFrTranslationMessages),
  'pl-PL': formatTranslationMessages('pl-PL', plPlTranslationMessages),
  'pt-BR': formatTranslationMessages('pt-BR', ptBrTranslationMessages),
};
