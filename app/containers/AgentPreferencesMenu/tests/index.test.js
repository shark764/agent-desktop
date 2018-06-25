/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { AgentPreferencesMenu } from '../index';

describe('<AgentPreferencesMenu />', () => {
  it('renders the preferences options by default', () => {
    const rendered = shallow(
      <AgentPreferencesMenu isVisible hideMenu={() => {}} />
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
