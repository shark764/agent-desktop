/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import ButtonMenu from '../index';

const mockFunc = jest.fn();

const menuItems = {
  buttonConfig: [
    {
      id: 'test-id-1',
      type: 'primaryRed',
      text: {
        id: 'app.containers.EmailContentArea.send',
        defaultMessage: 'Send',
      },
      onClick: mockFunc,
      disabled: false,
      style: {
        marginRight: '8px',
      },
    },
    {
      id: 'test-id-2',
      type: 'primaryBlue',
      text: {
        id: 'app.containers.EmailContentArea.send',
        defaultMessage: 'Send',
      },
      onClick: mockFunc,
      disabled: false,
      style: {
        marginRight: '8px',
      },
    },
  ],
  wrapupToggleConfig: {
    toggleId: 'toggle-test-id',
    icons: false,
    onChange: mockFunc,
    toggleDisabled: false,
    checked: true,
  },
};

const menuItemsNoToggle = {
  buttonConfig: [
    {
      id: 'test-id-1',
      type: 'primaryRed',
      text: {
        id: 'app.containers.EmailContentArea.send',
        defaultMessage: 'Send',
      },
      onClick: mockFunc,
      disabled: false,
      style: {
        marginRight: '8px',
      },
    },
    {
      id: 'test-id-2',
      type: 'primaryBlue',
      text: {
        id: 'app.containers.EmailContentArea.send',
        defaultMessage: 'Send',
      },
      onClick: mockFunc,
      disabled: false,
      style: {
        marginRight: '8px',
      },
    },
  ],
};

describe('<ButtonMenu />', () => {
  describe('with required props and text', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ButtonMenu
          id="buttonMenuId"
          type="primaryBlue"
          text="test text"
          menuItems={menuItems}
        />
      );

      expect(rendered).toMatchSnapshot();
    });

    it('in toolbar mode, should render the menu containing the wrapup toggle switch if we are passing valid values to the wrapupToggleConfig', () => {
      const rendered = shallow(
        <ButtonMenu
          id="buttonMenuId"
          type="primaryBlue"
          text="test text"
          menuItems={menuItems}
        />,
        {
          context: {},
        }
      );

      rendered.setContext({ toolbarMode: true });
      rendered.find('#buttonMenuId').simulate('click');
      expect(rendered.state('showSubMenu')).toBe(true);
      expect(rendered.find('#toggle-test-id').exists()).toBe(true);
    });

    it('in toolbar mode, should NOT render the wrapup toggle switch if there is no wrapupToggleConfig data passed to menuItems', () => {
      const rendered = shallow(
        <ButtonMenu
          id="buttonMenuId"
          type="primaryBlue"
          text="test text"
          menuItems={menuItemsNoToggle}
        />,
        {
          context: {},
        }
      );

      rendered.setContext({ toolbarMode: true });
      rendered.find('#buttonMenuId').simulate('click');
      expect(rendered.find('#toggle-test-id').exists()).toBe(false);
    });
  });
});
