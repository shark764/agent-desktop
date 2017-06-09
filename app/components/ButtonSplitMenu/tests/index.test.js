/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import ButtonSplitMenu from '../index';

describe('<ButtonSplitMenu />', () => {
  describe('with required props and text', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ButtonSplitMenu
          id="mockId"
          onClick={() => {}}
          type={'primaryBlue'}
          text={'testing'}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with disabled true', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <ButtonSplitMenu
          id="mockId"
          onClick={() => {}}
          type={'primaryBlue'}
          disabled
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when dropdown-button is clicked', () => {
    it('should set state.showMenu to be true', () => {
      const rendered = shallow(
        <ButtonSplitMenu
          id="mockId"
          onClick={() => {}}
          type={'primaryBlue'}
          disabled
        />
      );

      rendered.find('#mockId-dropdown-button').simulate('click');
      expect(rendered.state('showMenu')).toBe(true);
    });
  });
});
