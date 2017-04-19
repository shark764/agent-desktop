import React from 'react';
import { shallow } from 'enzyme';

import A from '../index';

describe('<A />', () => {
  it('should render correctly', () => {
    const rendered = shallow(<A text="mockText" id="mockId" />);
    expect(rendered).toMatchSnapshot();
  });
});
