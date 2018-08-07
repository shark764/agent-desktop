/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { mount } from 'enzyme';

import ContextProvider from 'containers/ContextProvider';
import { SidePanelToolbarBtn } from '../index';

describe('<SidePanelToolbarBtn />', () => {
  it('should render correctly', () => {
    global.jsdom.reconfigure({
      url: 'https://dev-tb2.cxengagelabs.net/',
    });
    const rendered = mount(
      <ContextProvider>
        <SidePanelToolbarBtn
          isSidePanelCollapsed
          selectedInteractionScript={{ testing: 'testing' }}
          selectedInteractionIsScriptOnly={false}
          hasAssignedContact
        />
      </ContextProvider>
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should not render', () => {
    global.jsdom.reconfigure({
      url: 'https://dev-desktop.cxengagelabs.net/',
    });
    const rendered = mount(
      <ContextProvider>
        <SidePanelToolbarBtn
          isSidePanelCollapsed
          selectedInteractionScript={{ testing: 'testing' }}
          selectedInteractionIsScriptOnly={false}
          hasAssignedContact={false}
        />
      </ContextProvider>
    );
    expect(rendered).toMatchSnapshot();
  });
});
