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
      return (
        <div>
          Toolbar
          {this.context.crmEnabled && <div>CRM Enabled</div>}
        </div>
      );
    } else {
      return (
        <div>
          Desktop
          {this.context.crmEnabled && <div>CRM Enabled</div>}
        </div>
      );
    }
  }
}

TestApp.contextTypes = {
  toolbarMode: PropTypes.bool,
  crmEnabled: PropTypes.bool,
};

describe('<ContextProvider />', () => {
  it('should set context flags correctly for desktop url', () => {
    const rendered = mount(
      <ContextProvider>
        <TestApp />
      </ContextProvider>
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should set flags correctly when url for toolbar is hit', () => {
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: 'https://dev-tb2.cxengagelabs.net/',
    });
    const rendered = mount(
      <ContextProvider>
        <TestApp />
      </ContextProvider>
    );
    expect(rendered).toMatchSnapshot();
  });
});
