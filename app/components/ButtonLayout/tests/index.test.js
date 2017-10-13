/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import ButtonLayout from '../index';

const menuItems = {
  buttonConfig: [
    {
      id: 'test-id-1',
      type: 'primaryRed',
      text: {
        id: 'app.containers.EmailContentArea.send',
        defaultMessage: 'Send',
      },
      onClick: () => {},
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
      onClick: () => {},
      disabled: false,
      style: {
        marginRight: '8px',
      },
    },
  ],
  wrapupToggleConfig: {
    toggleId: 'toggle-id',
    icons: false,
    onChange: () => {},
    toggleDisabled: false,
    checked: true,
  },
};

const buttonMenuConfig = {
  id: 'testId',
  type: 'primaryBlue',
  text: 'testText',
};

describe('<ButtonLayout />', () => {
  describe('when IS NOT set to toolbar mode', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ButtonLayout
          menuItems={menuItems}
          buttonMenuConfig={buttonMenuConfig}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when IS set to toolbar mode', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ButtonLayout
          menuItems={menuItems}
          buttonMenuConfig={buttonMenuConfig}
        />,
        {
          context: {},
        }
      );

      rendered.setContext({ toolbarMode: true });
      expect(rendered).toMatchSnapshot();
    });
  });
});
