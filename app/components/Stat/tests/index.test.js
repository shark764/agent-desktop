/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import Stat from '../index';

describe('<Stat />', () => {
  const rendered = shallow(
    <Stat
      intl={getIntlContext()}
      userFriendlyName="mockName"
      index={1}
      stat={{
        statAggregate: 'mockStatAggregate',
        statSource: 'resource-id',
      }}
      removeStat={() => {}}
      readyState="mockReadyState"
      queues={[]}
      detailsPosition="right"
    />
  );
  it('should render correctly', () => {
    expect(rendered).toMatchSnapshot();
  });
  it('should show hover details on mouse over', () => {
    rendered.find('.stat-box').simulate('MouseOver');
    expect(rendered).toMatchSnapshot();
  });
});
