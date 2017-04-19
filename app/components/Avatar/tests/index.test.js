import React from 'react';
import { shallow } from 'enzyme';

import Avatar from '../index';

describe('<Avatar />', () => {
  it('should render correctly', () => {
    const rendered = shallow(<Avatar id="mockId" />);
    expect(rendered).toMatchSnapshot();
  });
});
