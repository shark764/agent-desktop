/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { PreferenceOption } from '..';

describe('<PreferenceOption />', () => {
  const mockSetPreferenceSelected = jest.fn();
  const rendered = shallow(
    <PreferenceOption
      preference="metrics"
      label={{
        id: 'app.containers.AgentPreferencesMenu.metrics',
        defaultMessage: 'Metrics',
      }}
      setPreferenceSelected={mockSetPreferenceSelected}
    />
  );
  it('renders correctly', () => {
    expect(rendered).toMatchSnapshot();
  });
  it('calls setPreferenceSelected when clicked', () => {
    rendered.find('#metrics-preference').simulate('click');
    expect(mockSetPreferenceSelected).toBeCalledWith('metrics');
  });
});
