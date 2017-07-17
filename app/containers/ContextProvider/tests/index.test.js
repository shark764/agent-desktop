/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import { ContextProvider } from '../index';

// eslint-disable-next-line react/prefer-stateless-function
class TestApp extends React.Component {
  render() {
    if (this.context.toolbarMode) {
      return <div>Toolbar</div>;
    } else {
      return <div>Desktop</div>;
    }
  }
}

TestApp.contextTypes = {
  toolbarMode: PropTypes.bool,
};

describe('<ContextProvider />', () => {
  it('should set toolbarMode flag correctly', () => {
    const rendered = mount(
      <ContextProvider>
        <TestApp />
      </ContextProvider>
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should set toolbarMode flag correctly when url for toolbar is hit', () => {
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/toolbar',
    });
    const rendered = mount(
      <ContextProvider>
        <TestApp />
      </ContextProvider>
    );
    expect(rendered).toMatchSnapshot();
  });
});
