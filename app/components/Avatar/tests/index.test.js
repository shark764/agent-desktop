/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Avatar from '../index';

describe('<Avatar />', () => {
  describe('when only passed id prop', () => {
    it('should render correctly', () => {
      const rendered = shallow(<Avatar id="mockId" />);
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when passed customerAvatarIndex', () => {
    it('should render correctly', () => {
      const rendered = shallow(<Avatar id="mockId" customerAvatarIndex={1} />);
      expect(rendered).toMatchSnapshot();
    });
  });
});
