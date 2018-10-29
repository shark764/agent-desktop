/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { AgentPreferencesMenu } from '../index';

describe('<AgentPreferencesMenu />', () => {
  it('renders the preferences options by default', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission
        isVisible
        hideMenu={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('does not render the metrics option when the agent does not have the view stats permission', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission={false}
        isVisible
        hideMenu={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders AgentStatsMenu when it is set in state', () => {
    const rendered = shallow(
      <AgentPreferencesMenu isVisible hideMenu={() => {}} />
    );
    rendered.setState({ preferenceSelected: 'metrics' });
    expect(rendered).toMatchSnapshot();
  });
  it('renders AgentNotificationsMenu when it is set in state', () => {
    const rendered = shallow(
      <AgentPreferencesMenu isVisible hideMenu={() => {}} />
    );
    rendered.setState({ preferenceSelected: 'notifications' });
    expect(rendered).toMatchSnapshot();
  });
});
