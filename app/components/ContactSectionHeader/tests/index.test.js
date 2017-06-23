/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import ContactSectionHeader from '../index';

describe('<ContactSectionHeader />', () => {
  it('should render correctly', () => {
    const rendered = shallow(<ContactSectionHeader id="mockId" label="mock" />);
    expect(rendered).toMatchSnapshot();
  });
});
