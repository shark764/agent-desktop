/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import csLocaleData from 'react-intl/locale-data/cs';
import deLocaleData from 'react-intl/locale-data/de';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';
import fiLocaleData from 'react-intl/locale-data/fi';
import frLocaleData from 'react-intl/locale-data/fr';
import itLocaleData from 'react-intl/locale-data/it';
import jaLocaleData from 'react-intl/locale-data/ja';
import koLocaleData from 'react-intl/locale-data/ko';
import nbLocaleData from 'react-intl/locale-data/nb';
import nlLocaleData from 'react-intl/locale-data/nl';
import plLocaleData from 'react-intl/locale-data/pl';
import ptLocaleData from 'react-intl/locale-data/pt';
import svLocaleData from 'react-intl/locale-data/sv';
import zhLocaleData from 'react-intl/locale-data/zh';

/**
 * We import moment just to set locale
 * for internationalization.
 *
 * Import here all supported languages, so
 * they can be set as global locale.
 */
import moment from 'moment';
import 'moment/locale/cs';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import 'moment/locale/fi';
import 'moment/locale/fr-ca';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/ja';
import 'moment/locale/ko';
import 'moment/locale/nb';
import 'moment/locale/nl';
import 'moment/locale/pl';
import 'moment/locale/pt-br';
import 'moment/locale/sv';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';

/**
 * serenova-client-strings contains translator files
 * for each language.
 *
 * Using:
 *    zh-CN for "zh-Hans"
 *    zh-TW for "zh-Hant"
 */
import csCzTranslationMessages from 'serenova-client-strings/agent-desktop/cs-CZ.json';
import deDeTranslationMessages from 'serenova-client-strings/agent-desktop/de-DE.json';
import enGbTranslationMessages from 'serenova-client-strings/agent-desktop/en-GB.json';
import enUsTranslationMessages from 'serenova-client-strings/agent-desktop/en-US.json';
import esEsTranslationMessages from 'serenova-client-strings/agent-desktop/es-ES.json';
import fiFiTranslationMessages from 'serenova-client-strings/agent-desktop/fi-FI.json';
import frCaTranslationMessages from 'serenova-client-strings/agent-desktop/fr-CA.json';
import frFrTranslationMessages from 'serenova-client-strings/agent-desktop/fr-FR.json';
import itItTranslationMessages from 'serenova-client-strings/agent-desktop/it-IT.json';
import jaJpTranslationMessages from 'serenova-client-strings/agent-desktop/ja-JP.json';
import koKrTranslationMessages from 'serenova-client-strings/agent-desktop/ko-KR.json';
import nbNoTranslationMessages from 'serenova-client-strings/agent-desktop/nb-NO.json';
import nlNlTranslationMessages from 'serenova-client-strings/agent-desktop/nl-NL.json';
import plPlTranslationMessages from 'serenova-client-strings/agent-desktop/pl-PL.json';
import ptBrTranslationMessages from 'serenova-client-strings/agent-desktop/pt-BR.json';
import svSeTranslationMessages from 'serenova-client-strings/agent-desktop/sv-SE.json';
import zhCnTranslationMessages from 'serenova-client-strings/agent-desktop/zh-CN.json';
import zhTwTranslationMessages from 'serenova-client-strings/agent-desktop/zh-TW.json';

import { DEFAULT_LOCALE } from './containers/AgentDesktop/constants';

addLocaleData(csLocaleData);
addLocaleData(deLocaleData);
addLocaleData(enLocaleData);
addLocaleData(esLocaleData);
addLocaleData(fiLocaleData);
addLocaleData(frLocaleData);
addLocaleData(itLocaleData);
addLocaleData(jaLocaleData);
addLocaleData(koLocaleData);
addLocaleData(nbLocaleData);
addLocaleData(nlLocaleData);
addLocaleData(plLocaleData);
addLocaleData(ptLocaleData);
addLocaleData(svLocaleData);
addLocaleData(zhLocaleData);

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

/**
 * By default will be set with "en-US".
 * If a non-imported locale is received it will
 * set the default language.
 */
export const setGlobalLocale = (locale) => moment.locale(locale);

export const mappedLocales = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'cs-CZ', label: 'Čeština (Czech Republic)' },
  { value: 'de-DE', label: 'Deutsche (Deutschland)' },
  { value: 'en-GB', label: 'English (Great Britain)' },
  { value: 'es-ES', label: 'Español (España)' }, // Castilian Spanish - Grande!!
  { value: 'fr-CA', label: 'Français (Canada)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'it-IT', label: 'Italiano (Italia)' },
  { value: 'ja-JP', label: '日本語 (日本)' }, // Standard Japanese
  { value: 'ko-KR', label: '한국어 (한국)' }, // Standard Korean
  { value: 'nb-NO', label: 'Norsk (Norge)' }, // Standard Norwegian
  { value: 'nl-NL', label: 'Nederlands (Nederland)' },
  { value: 'pl-PL', label: 'Polski (Polska)' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'fi-FI', label: 'Suomi (Suomessa)' }, // Standard Finnish
  { value: 'sv-SE', label: 'Svenska (Sverige)' }, // Standard Swedish
  { value: 'zh-CN', label: '简体中文 (中国)' }, // Simplified Chinese
  { value: 'zh-TW', label: '繁體中文 (中文 - 台灣)' }, // Traditional Chinese - Taiwan
];

export const translationMessages = {
  'en-US': formatTranslationMessages('en-US', enUsTranslationMessages),
  'cs-CZ': formatTranslationMessages('cs-CZ', csCzTranslationMessages),
  'de-DE': formatTranslationMessages('de-DE', deDeTranslationMessages),
  'en-GB': formatTranslationMessages('en-GB', enGbTranslationMessages),
  'es-ES': formatTranslationMessages('es-ES', esEsTranslationMessages),
  'fi-FI': formatTranslationMessages('fi-FI', fiFiTranslationMessages),
  'fr-CA': formatTranslationMessages('fr-CA', frCaTranslationMessages),
  'fr-FR': formatTranslationMessages('fr-FR', frFrTranslationMessages),
  'it-IT': formatTranslationMessages('it-IT', itItTranslationMessages),
  'ja-JP': formatTranslationMessages('ja-JP', jaJpTranslationMessages),
  'nb-NO': formatTranslationMessages('nb-NO', nbNoTranslationMessages),
  'nl-NL': formatTranslationMessages('nl-NL', nlNlTranslationMessages),
  'ko-KR': formatTranslationMessages('ko-KR', koKrTranslationMessages),
  'pl-PL': formatTranslationMessages('pl-PL', plPlTranslationMessages),
  'pt-BR': formatTranslationMessages('pt-BR', ptBrTranslationMessages),
  'sv-SE': formatTranslationMessages('sv-SE', svSeTranslationMessages),
  'zh-CN': formatTranslationMessages('zh-CN', zhCnTranslationMessages),
  'zh-TW': formatTranslationMessages('zh-TW', zhTwTranslationMessages),
};
