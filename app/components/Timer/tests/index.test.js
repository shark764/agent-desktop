import React from 'react';
import { shallow } from 'enzyme';

import Timer from '../index';

describe('<Timer />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Timer
        id="mockId"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
