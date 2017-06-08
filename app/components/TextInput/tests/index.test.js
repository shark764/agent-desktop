/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import TextInput from '../index';

describe('<TextInput />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <TextInput.WrappedComponent
        id="mockId"
        intl={getIntlContext()}
        cb={() => {}}
        value="mockValue"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
