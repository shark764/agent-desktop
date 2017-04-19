import React from 'react';
import { shallow } from 'enzyme';

import Dialpad from '../index';

describe('<Dialpad />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Dialpad
        id="mockId"
        dialpadText="mockDialpadText"
        setDialpadText={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
