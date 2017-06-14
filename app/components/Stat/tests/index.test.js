/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import Stat from '../index';

describe('<Stat />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Stat
        id="mockId"
        intl={getIntlContext()}
        userFriendlyName="mockName"
        hover
        index={1}
        stat={{
          statAggregate: 'mockStatAggregate',
          statSource: 'resource-id',
        }}
        removeStat={() => {}}
        readyState="mockReadyState"
        queues={[]}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
