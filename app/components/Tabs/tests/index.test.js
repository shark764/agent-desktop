/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Tabs from '../index';

const types = ['big', 'small'];

describe('<Tabs />', () => {
  types.forEach((type) => {
    describe(`with type ${type}`, () => {
      it('should render correctly', () => {
        const rendered = shallow(
          <Tabs
            id="mockId"
            type={type}
          >
            {[]}
          </Tabs>
        );
        expect(rendered).toMatchSnapshot();
      });
    });
  });
});
