import React from 'react';
import { shallow } from 'enzyme';

import TimeStat from '../index';

describe('<TimeStat />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <TimeStat
        id="mockId"
        time={1}
        unit="millis"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
