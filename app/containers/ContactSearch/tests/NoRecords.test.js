/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { NoRecords } from '../NoRecords';

describe('<NoRecords />', () => {
  it('should render without outbound buttons by default', () => {
    const rendered = shallow(<NoRecords query={{}} newContact={() => {}} />);
    expect(rendered).toMatchSnapshot();
  });
  it('should render with outbound buttons when a valid phone number is passed in as the only query parameter', () => {
    const rendered = shallow(
      <NoRecords
        query={{ phoneNumberAttribute: '+15064701234' }}
        newContact={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
