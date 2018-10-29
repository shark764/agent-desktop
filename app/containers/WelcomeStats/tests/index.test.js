/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { WelcomeStats } from '../index';

describe('<WelcomeStats />', () => {
  const mockAgent = {
    lastName: 'Flippenbaum',
    firstName: 'Avner',
  };

  const mockWelcomeStats = {
    customerSatisfactionScore: {},
    workAcceptedCount: {},
    resourceHandleTime: {},
  };

  it('should render correctly in toolbar mode', () => {
    const context = { toolbarMode: true };
    const rendered = shallow(
      <WelcomeStats
        hasViewStatsPermission
        agent={mockAgent}
        welcomeStats={mockWelcomeStats}
      />,
      { context }
    );

    expect(rendered).toMatchSnapshot();
  });
  it('should not render in toolbar mode when no view stats permissions', () => {
    const context = { toolbarMode: true };
    const rendered = shallow(
      <WelcomeStats
        hasViewStatsPermission={false}
        agent={mockAgent}
        welcomeStats={mockWelcomeStats}
      />,
      { context }
    );

    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly in agent desktop mode', () => {
    const rendered = shallow(
      <WelcomeStats
        hasViewStatsPermission
        agent={mockAgent}
        welcomeStats={mockWelcomeStats}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should not render in agent desktop mode when no view stats permissions', () => {
    const rendered = shallow(
      <WelcomeStats
        hasViewStatsPermission={false}
        agent={mockAgent}
        welcomeStats={mockWelcomeStats}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
