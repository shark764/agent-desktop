/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import IconSVG, { availableIcons } from '../index';

describe('<IconSVG />', () => {
  availableIcons.forEach((name) => {
    describe(`with name ${name}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <IconSVG
            id="mockId"
            name={name}
          />
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
