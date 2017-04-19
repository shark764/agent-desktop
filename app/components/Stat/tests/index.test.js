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
        statistic={{
          type: 'mockType',
          userFriendlyName: 'mockName',
        }}
        hover
        index={1}
        hoverData={{
          statAggregate: 'mockStatAggregate',
          statSource: 'mockStatSource',
        }}
        toggleStat={() => {}}
        readyState="mockReadyState"
        queues={[]}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
