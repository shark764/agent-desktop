/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { mockComponent } from 'utils/test';
import PreferenceOption from 'components/PreferenceOption';

import * as AOSelectors from 'containers/AudioOutputMenu/selectors';
import * as Selectors from '../selectors';
import { AgentPreferencesMenu } from '..';

/**
 * We need to mock these components like this, since they're still written
 * as classes with react-redux "connect"
 */
jest.mock('containers/AgentStatsMenu', () => mockComponent('AgentStatsMenu'));
jest.mock('containers/AgentTransferMenuPreferenceMenu', () =>
  mockComponent('AgentTransferMenuPreferenceMenu')
);
jest.mock('components/ErrorBoundary', () => mockComponent('ErrorBoundary'));

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
}));

jest.spyOn(AOSelectors, 'selectOutputSelectionSupported').mockReturnValue(true);
jest.spyOn(AOSelectors, 'selectActiveExtensionIsTwilio').mockReturnValue(true);
jest.spyOn(Selectors, 'selectHasViewStatsPermission').mockReturnValue(true);

describe('<AgentPreferencesMenu />', () => {
  const setPreferenceSelected = jest.fn();
  const useStateMock = (preferenceSelected) => [
    preferenceSelected,
    setPreferenceSelected,
  ];
  jest.spyOn(React, 'useState').mockImplementation(useStateMock);

  jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders the preferences options by default', () => {
    const rendered = shallow(
      <AgentPreferencesMenu isVisible hideMenu={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('does not render the metrics option when the agent does not have the view stats permission', () => {
    jest
      .spyOn(Selectors, 'selectHasViewStatsPermission')
      .mockReturnValueOnce(false);
    const rendered = shallow(
      <AgentPreferencesMenu isVisible hideMenu={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('does not render the audioOutput option when the agent has not give browser permission to use mic/audio devices', () => {
    jest
      .spyOn(AOSelectors, 'selectOutputSelectionSupported')
      .mockReturnValueOnce(false);
    const rendered = shallow(
      <AgentPreferencesMenu isVisible hideMenu={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('does not render the audioOutput option when the active extension is PSTN', () => {
    jest
      .spyOn(AOSelectors, 'selectOutputSelectionSupported')
      .mockReturnValueOnce(false);
    jest
      .spyOn(AOSelectors, 'selectActiveExtensionIsTwilio')
      .mockReturnValueOnce(false);
    const rendered = shallow(
      <AgentPreferencesMenu isVisible hideMenu={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });

  describe('calling menu option "setPreferenceSelected" method', () => {
    it('renders AgentStatsMenu when it is set in state', () => {
      const rendered = shallow(
        <AgentPreferencesMenu isVisible hideMenu={() => {}} />
      );

      rendered
        .find(PreferenceOption)
        .first()
        .props()
        .setPreferenceSelected('metrics');

      expect(rendered).toMatchSnapshot();
    });
    it('renders AgentNotificationsMenu when it is set in state', () => {
      const rendered = shallow(
        <AgentPreferencesMenu isVisible hideMenu={() => {}} />
      );
      rendered
        .find(PreferenceOption)
        .first()
        .props()
        .setPreferenceSelected('notifications');

      expect(rendered).toMatchSnapshot();
    });
    it('renders AudioOutputMenu when it is set in state', () => {
      const rendered = shallow(
        <AgentPreferencesMenu isVisible hideMenu={() => {}} />
      );
      rendered
        .find(PreferenceOption)
        .first()
        .props()
        .setPreferenceSelected('audioOutput');

      expect(rendered).toMatchSnapshot();
    });
    it('renders AgentTransferMenuPreferenceMenu when it is set in state', () => {
      const rendered = shallow(
        <AgentPreferencesMenu isVisible hideMenu={() => {}} />
      );
      rendered
        .find(PreferenceOption)
        .first()
        .props()
        .setPreferenceSelected('transferMenu');

      expect(rendered).toMatchSnapshot();
    });
  });

  describe('clearing menu option with "setPreferenceSelected" method on useffect execution', () => {
    let useEffect;
    let rendered;

    const mockUseEffect = () => {
      useEffect.mockImplementationOnce((f) => f());
    };

    beforeEach(() => {
      useEffect = jest.spyOn(React, 'useEffect');

      mockUseEffect(); // important to do it twice
      mockUseEffect();
      rendered = shallow(
        <AgentPreferencesMenu isVisible hideMenu={() => {}} />
      );
    });
    it('should change preferenceSelected to <undefined> when active extension prop changes', () => {
      rendered
        .find(PreferenceOption)
        .at(2)
        .props()
        .setPreferenceSelected('audioOutput');

      jest
        .spyOn(AOSelectors, 'selectActiveExtensionIsTwilio')
        .mockReturnValueOnce(false);

      expect(rendered).toMatchSnapshot();
    });
  });
});
