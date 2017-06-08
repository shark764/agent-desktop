/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import Filter from '../index';

describe('<Filter />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Filter.WrappedComponent
        id="mockId"
        name="mockName"
        value="mockValue"
        remove={() => {}}
        intl={getIntlContext()}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
