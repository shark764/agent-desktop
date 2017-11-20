/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import { CurrentCrmItemHistoryContentArea } from '../index';

describe('<CurrentCrmItemHistoryContentArea />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <CurrentCrmItemHistoryContentArea
        zendeskActiveTab={fromJS({
          id: 123,
          type: 'user',
          attributes: {
            name: 'test-name',
          },
        })}
        closeCurrentCrmItemHistoryPanel={() => {}}
        loadCrmInteractionHistory={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
