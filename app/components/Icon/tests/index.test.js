/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Icon, { availableIcons, availableIconsWithActive } from '../index';

describe('<Icon />', () => {
  availableIcons.forEach((name) => {
    describe(`with name ${name}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(<Icon id="mockId" name={name} />);
        expect(rendered).toMatchSnapshot();
      });
    });
  });

  availableIconsWithActive.forEach((name) => {
    describe(`with name ${name} and active prop`, () => {
      it('should render correctly', () => {
        const rendered = shallow(<Icon id="mockId" name={name} active />);
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
