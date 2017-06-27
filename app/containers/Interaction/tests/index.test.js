/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import { Interaction } from '../index';

describe('<Interaction />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Interaction
        id="mockId"
        status="pending"
        awaitingDisposition
        icon="config"
        intl={getIntlContext()}
        activeExtension={{}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
