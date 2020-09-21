/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import PreferenceOption from 'components/PreferenceOption';

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

  describe('calling menu option "setPreferenceSelected" method', () => {
    it('should change preferenceSelected to "metrics" when setPreferenceSelected in PreferenceOption is clicked', () => {
      const rendered = shallow(
        <AgentPreferencesMenu
          hasViewStatsPermission
          isOutputSelectionSupported
          isVisible
          hideMenu={() => {}}
          activeExtensionIsTwilio
        />
      );
      expect(rendered.state('preferenceSelected')).toBe(undefined);

      rendered
        .find(PreferenceOption)
        .first()
        .props()
        .setPreferenceSelected('metrics');

      expect(rendered.state('preferenceSelected')).toBe('metrics');
    });
    it('should change preferenceSelected to "notifications" when AgentStats menu is not available and setPreferenceSelected in PreferenceOption is clicked', () => {
      const rendered = shallow(
        <AgentPreferencesMenu
          hasViewStatsPermission={false}
          isOutputSelectionSupported
          isVisible
          hideMenu={() => {}}
          activeExtensionIsTwilio
        />
      );
      expect(rendered.state('preferenceSelected')).toBe(undefined);

      rendered
        .find(PreferenceOption)
        .first()
        .props()
        .setPreferenceSelected('notifications');

      expect(rendered.state('preferenceSelected')).toBe('notifications');
    });
    it('should change preferenceSelected to "audioOutput" when AudioOutput menu is available and setPreferenceSelected in PreferenceOption is clicked', () => {
      const rendered = shallow(
        <AgentPreferencesMenu
          hasViewStatsPermission
          isOutputSelectionSupported
          isVisible
          hideMenu={() => {}}
          activeExtensionIsTwilio
        />
      );
      expect(rendered.state('preferenceSelected')).toBe(undefined);

      rendered
        .find(PreferenceOption)
        .at(2)
        .props()
        .setPreferenceSelected('audioOutput');

      expect(rendered.state('preferenceSelected')).toBe('audioOutput');
    });
    it('should change preferenceSelected to "transferMenu" when setPreferenceSelected in PreferenceOption is clicked', () => {
      const rendered = shallow(
        <AgentPreferencesMenu
          hasViewStatsPermission
          isOutputSelectionSupported
          isVisible
          hideMenu={() => {}}
          activeExtensionIsTwilio={false}
        />
      );
      expect(rendered.state('preferenceSelected')).toBe(undefined);

      rendered
        .find(PreferenceOption)
        .at(2)
        .props()
        .setPreferenceSelected('transferMenu');

      expect(rendered.state('preferenceSelected')).toBe('transferMenu');
    });
  });

  describe('clearing menu option with "setPreferenceSelected" method on componentDidUpdate', () => {
    it('should change preferenceSelected to <undefined> when active extension prop changes', () => {
      const rendered = shallow(
        <AgentPreferencesMenu
          hasViewStatsPermission
          isOutputSelectionSupported
          isVisible
          hideMenu={() => {}}
          activeExtensionIsTwilio
        />
      );
      rendered
        .find(PreferenceOption)
        .at(2)
        .props()
        .setPreferenceSelected('audioOutput');
      expect(rendered.state('preferenceSelected')).toBe('audioOutput');

      rendered.setProps({ activeExtensionIsTwilio: false });
      expect(rendered.state('preferenceSelected')).toBe(undefined);
    });
  });
});
