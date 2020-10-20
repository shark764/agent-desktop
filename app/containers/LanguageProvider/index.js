/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `serenova-client-strings/agent-desktop`)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { selectLocale } from './selectors';
import { changeLocale } from './actions';
const storage = window.localStorage;

export const LanguageProvider = (props) => {
  const locale = useSelector((state) => selectLocale()(state));
  const dispatch = useDispatch();

  const storedLocale = storage.getItem('locale');
  if (storedLocale) {
    dispatch(changeLocale(storedLocale));
  }

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      messages={props.messages[locale]}
    >
      {React.Children.only(props.children)}
    </IntlProvider>
  );
};

LanguageProvider.propTypes = {
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default LanguageProvider;
