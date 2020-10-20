/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */
import React from 'react';
import { createStore } from 'redux';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import enUS from 'serenova-client-strings/agent-desktop/en-US.json';
enUS['app.test.mockMessage'] = 'mock message'; // Mock message we can use in tests

export const getIntlContext = () => {
  // Construct a new `IntlProvider` instance by passing `props` and
  // `context` as React would, then call `getChildContext()` to get the
  // React Intl API, complete with the `format*()` functions.
  const intlProvider = new IntlProvider(
    { locale: 'en-US', messages: enUS },
    {}
  );
  const { intl } = intlProvider.getChildContext();
  return intl;
};

export const mockStore = createStore((state) => state);

export function mockComponent(componentName) {
  const MockedComponent = (props) => (
    <mocked originalComponent={componentName} {...props}>
      {props.children}
    </mocked>
  );

  MockedComponent.propTypes = {
    children: PropTypes.node,
  };

  return MockedComponent;
}
