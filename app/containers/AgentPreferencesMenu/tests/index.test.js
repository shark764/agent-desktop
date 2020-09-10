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
        isOutputSelectionSupported
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('does not render the metrics option when the agent does not have the view stats permission', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission={false}
        isOutputSelectionSupported
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('does not render the audioOutput option when the agent has not give browser permission to use mic/audio devices', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission
        isOutputSelectionSupported={false}
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('does not render the audioOutput option when the active extension is PSTN', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission
        isOutputSelectionSupported={false}
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio={false}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders AgentStatsMenu when it is set in state', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission
        isOutputSelectionSupported
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio
      />
    );
    rendered.setState({ preferenceSelected: 'metrics' });
    expect(rendered).toMatchSnapshot();
  });
  it('renders AgentNotificationsMenu when it is set in state', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission
        isOutputSelectionSupported
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio
      />
    );
    rendered.setState({ preferenceSelected: 'notifications' });
    expect(rendered).toMatchSnapshot();
  });
  it('renders AudioOutputMenu when it is set in state', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission
        isOutputSelectionSupported
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio
      />
    );
    rendered.setState({ preferenceSelected: 'audioOutput' });
    expect(rendered).toMatchSnapshot();
  });
  it('renders AgentTransferMenuPreferenceMenu when it is set in state', () => {
    const rendered = shallow(
      <AgentPreferencesMenu
        hasViewStatsPermission
        isOutputSelectionSupported
        isVisible
        hideMenu={() => {}}
        activeExtensionIsTwilio
      />
    );
    rendered.setState({ preferenceSelected: 'transferMenu' });
    expect(rendered).toMatchSnapshot();
  });
});
