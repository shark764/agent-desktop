/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { AgentNotificationsMenu } from '../index';

describe('<AgentNotificationsMenu />', () => {
  describe('parent window is the same', () => {
    describe('notifications enabled', () => {
      const rendered = shallow(
        <AgentNotificationsMenu
          audioNotificationsEnabled
          visualNotificationsEnabled
          toggleAudioNotificationsPreference={() => {}}
          toggleVisualNotificationsPreference={() => {}}
        />
      );
      it('renders the checkboxes', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
    describe('notifications disabled', () => {
      const rendered = shallow(
        <AgentNotificationsMenu
          toggleAudioNotificationsPreference={() => {}}
          toggleVisualNotificationsPreference={() => {}}
        />
      );
      it('does not render the checkboxes', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
    it('calls the functions when the preference is clicked', () => {
      const mockToggleAudioNotificationsPreference = jest.fn();
      const mockToggleVisualNotificationsPreference = jest.fn();
      const rendered = shallow(
        <AgentNotificationsMenu
          toggleAudioNotificationsPreference={
            mockToggleAudioNotificationsPreference
          }
          toggleVisualNotificationsPreference={
            mockToggleVisualNotificationsPreference
          }
        />
      );
      rendered.find('#audioNotificationOption').simulate('click');
      expect(mockToggleAudioNotificationsPreference).toBeCalled();
      rendered.find('#visualNotificationOption').simulate('click');
      expect(mockToggleVisualNotificationsPreference).toBeCalled();
    });
  });
  describe('parent window is different', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'parent', {
        writable: true,
        value: 'different parent',
      });
    });
    it("doesn't render the visual notification option", () => {
      const rendered = shallow(
        <AgentNotificationsMenu
          toggleAudioNotificationsPreference={() => {}}
          toggleVisualNotificationsPreference={() => {}}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
