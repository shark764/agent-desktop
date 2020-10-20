/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { AgentNotificationsMenu } from '../index';

import * as Selectors from '../selectors';
import * as Thunks from '../thunks';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

jest.spyOn(Selectors, 'selectAudioPreferences').mockReturnValue(true);
jest.spyOn(Selectors, 'selectVisualPreferences').mockReturnValue(true);
jest.spyOn(Thunks, 'toggleAudioNotificationsPreference');
jest.spyOn(Thunks, 'toggleVisualNotificationsPreference');

describe('<AgentNotificationsMenu />', () => {
  describe('parent window is the same', () => {
    describe('notifications enabled', () => {
      const rendered = shallow(<AgentNotificationsMenu />);
      it('renders the checkboxes', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
    describe('notifications disabled', () => {
      jest
        .spyOn(Selectors, 'selectAudioPreferences')
        .mockReturnValueOnce(false);
      jest
        .spyOn(Selectors, 'selectVisualPreferences')
        .mockReturnValueOnce(false);
      const rendered = shallow(<AgentNotificationsMenu />);
      it('does not render the checkboxes', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
    it('calls the functions when the preference is clicked', () => {
      const rendered = shallow(<AgentNotificationsMenu />);
      rendered.find('#audioNotificationOption').simulate('click');
      expect(Thunks.toggleAudioNotificationsPreference).toHaveBeenCalledTimes(
        1
      );
      rendered.find('#visualNotificationOption').simulate('click');
      expect(Thunks.toggleVisualNotificationsPreference).toHaveBeenCalledTimes(
        1
      );
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
      const rendered = shallow(<AgentNotificationsMenu />);
      expect(rendered).toMatchSnapshot();
    });
  });
});
