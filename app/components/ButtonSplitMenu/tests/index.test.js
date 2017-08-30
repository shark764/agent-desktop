/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import ButtonSplitMenu from '../index';

const mockFunc = jest.fn();
const buttonConfig = [
  {
    id: 'test-id-1',
    type: 'primaryRed',
    text: {
      id: 'app.containers.ContentAreaTop.wrapupOn',
      defaultMessage: 'Wrap Up On',
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
      id: 'app.containers.ContentAreaTop.wrapupOff',
      defaultMessage: 'Wrap Up Off',
    },
    onClick: mockFunc,
    disabled: false,
    style: {
      marginRight: '8px',
    },
    isMainBtn: true,
  },
];
const buttonConfigDisabled = [
  {
    id: 'test-id-1',
    type: 'primaryRed',
    text: {
      id: 'app.containers.EmailContentArea.cancel',
      defaultMessage: 'Cancel',
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
      id: 'app.containers.EmailContentArea.cancel',
      defaultMessage: 'Cancel',
    },
    onClick: mockFunc,
    disabled: true,
    style: {
      marginRight: '8px',
    },
    isMainBtn: true,
  },
];

describe('<ButtonSplitMenu />', () => {
  describe('with required props and text', () => {
    it('should render correctly', () => {
      const rendered = shallow(<ButtonSplitMenu buttonConfig={buttonConfig} />);
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with disabled true', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ButtonSplitMenu buttonConfig={buttonConfigDisabled} />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when dropdown-button click mask is clicked', () => {
    it('should display the submenu', () => {
      const rendered = shallow(<ButtonSplitMenu buttonConfig={buttonConfig} />);

      rendered.find('.button-dropdown-click-mask').simulate('click');
      expect(rendered.state('showSubMenu')).toBe(true);
    });
  });
});
