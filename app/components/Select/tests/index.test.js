import React from 'react';
import { shallow } from 'enzyme';

import Select from '../index';

describe('<Select />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Select
        id="mockId"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
