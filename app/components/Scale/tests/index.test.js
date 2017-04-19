import React from 'react';
import { shallow } from 'enzyme';

import Scale from '../index';

describe('<Scale />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Scale
        id="mockId"
        lowerBound={1}
        upperBound={2}
        onChange={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
